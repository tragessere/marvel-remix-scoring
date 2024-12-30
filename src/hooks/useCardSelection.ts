import { useContext } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CARD_SELECT_MODE, CardSelectionModeContext } from '../contexts/ContextList.tsx'
import { QueryParams } from '../types/route.ts'

export const useCardSelection = () => {
	const [ searchParams, setSearchParams ] = useSearchParams({ selectedCards: '' })
	const { setCardSelectMode } = useContext(CardSelectionModeContext)
	const selectedCards = searchParams.get(QueryParams.SELECTED_CARDS)
	const selectedCardIds = selectedCards ? selectedCards.split(',').map(Number) : []
	const lokiCard = searchParams.get(QueryParams.LOKI_CARD)
	const lokiCardId = lokiCard ? Number(lokiCard) : undefined

	const addCard = (cardId: number) => {
		if (selectedCardIds.includes(cardId)) return

		setSearchParams(searchParams => {
			searchParams.set(QueryParams.SELECTED_CARDS, selectedCardIds.concat(cardId).toString())
			return searchParams
		})
	}

	const setLokiDraw = (cardId: number | undefined) => {
		if (cardId && selectedCardIds.includes(cardId)) return

		// Don't add extra card if Loki is not selected
		if (!selectedCardIds.includes(73)) return

		setSearchParams(searchParams => {
			if (cardId) {
				searchParams.set(QueryParams.LOKI_CARD, cardId ? cardId.toString() : '')
			} else {
				searchParams.delete(QueryParams.LOKI_CARD)
			}
			return searchParams
		})
	}

	const removeCard = (cardId: number) => {
		if (!selectedCardIds.includes(cardId)) return

		if (cardId === 73) {
			setCardSelectMode(CARD_SELECT_MODE.DEFAULT)
		}

		setSearchParams(searchParams => {
			searchParams.set(QueryParams.SELECTED_CARDS, selectedCardIds.filter(id => id !== cardId).toString())

			// Remove extra drawn card if Loki is removed
			if (cardId === 73) {
				searchParams.delete(QueryParams.LOKI_CARD)
			}

			return searchParams
		})
	}

	const resetSelection = () => {
		setSearchParams({ [QueryParams.SELECTED_CARDS]: ''})
	}

	return {
		selectedCardIds,
		lokiCardId,
		addCard,
		setLokiDraw,
		removeCard,
		resetSelection
	}
}
