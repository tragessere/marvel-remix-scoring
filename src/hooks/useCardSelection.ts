import { useContext } from 'react'
import { useSearchParams } from 'react-router'
import { CARD_SELECT_MODE, CardSelectionModeContext } from '../contexts/ContextList.tsx'
import { QueryParams } from '../types/route.ts'
import {
	clearManualInput,
	ManualInputs,
	parseManualInputs,
	serializeManualInputs
} from '../utils/manualInput.ts'

const writeManualInputs = (searchParams: URLSearchParams, inputs: ManualInputs) => {
	const serialized = serializeManualInputs(inputs)
	if (serialized) {
		searchParams.set(QueryParams.MANUAL_INPUTS, serialized)
	} else {
		searchParams.delete(QueryParams.MANUAL_INPUTS)
	}
}

export const useCardSelection = () => {
	const [searchParams, setSearchParams] = useSearchParams({ selectedCards: '' })
	const { setCardSelectMode } = useContext(CardSelectionModeContext)
	const selectedCards = searchParams.get(QueryParams.SELECTED_CARDS)
	const selectedCardIds = selectedCards ? selectedCards.split(',').map(Number) : []
	const manualInputs = parseManualInputs(searchParams.get(QueryParams.MANUAL_INPUTS))

	const addCard = (cardId: number) => {
		if (selectedCardIds.includes(cardId)) return

		setSearchParams(searchParams => {
			searchParams.set(QueryParams.SELECTED_CARDS, selectedCardIds.concat(cardId).toString())
			return searchParams
		})
	}

	/**
	 * Record a board value the player entered for a card that can't be scored from the hand alone.
	 *
	 * @param cardId Card the value belongs to
	 * @param value Entered value, or `undefined` to clear it back to unanswered
	 */
	const setManualInput = (cardId: number, value: number | undefined) => {
		// Ignore values for cards that aren't in the hand
		if (!selectedCardIds.includes(cardId)) return

		setSearchParams(searchParams => {
			const updatedInputs =
				value === undefined ? clearManualInput(manualInputs, cardId) : { ...manualInputs, [cardId]: value }

			writeManualInputs(searchParams, updatedInputs)
			return searchParams
		})
	}

	/**
	 * Get the manually entered value for a given card ID.
	 *
	 * @param cardId Card the value belongs to
	 */
	const getManualInput = (cardId: number) => manualInputs[cardId] as number | undefined

	const removeCard = (cardId: number) => {
		if (!selectedCardIds.includes(cardId)) return

		if (cardId === 73) {
			setCardSelectMode(CARD_SELECT_MODE.DEFAULT)
		}

		setSearchParams(searchParams => {
			searchParams.set(QueryParams.SELECTED_CARDS, selectedCardIds.filter(id => id !== cardId).toString())

			// Drop any manual values entered for the removed card
			writeManualInputs(searchParams, clearManualInput(manualInputs, cardId))

			return searchParams
		})
	}

	const resetSelection = () => {
		setSearchParams({ [QueryParams.SELECTED_CARDS]: '' })
	}

	return {
		selectedCardIds,
		addCard,
		setManualInput,
		getManualInput,
		removeCard,
		resetSelection
	}
}
