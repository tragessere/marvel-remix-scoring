import { useSearchParams } from 'react-router-dom'
import { QueryParams } from '../types/route.ts'

export const useCardSelection = () => {
	const [ searchParams, setSearchParams ] = useSearchParams({ selectedCards: '' })
	const selectedCards = searchParams.get(QueryParams.SELECTED_CARDS)
	const selectedCardIds = selectedCards ? selectedCards.split(',').map(Number) : []

	const addCard = (cardId: number) => {
		if (selectedCardIds.includes(cardId)) return

		setSearchParams({ ...searchParams, [QueryParams.SELECTED_CARDS]: selectedCardIds.concat(cardId).toString()})
	}

	const removeCard = (cardId: number) => {
		if (!selectedCardIds.includes(cardId)) return

		setSearchParams({ ...searchParams, [QueryParams.SELECTED_CARDS]: selectedCardIds.filter(id => id !== cardId).toString()})
	}

	const resetSelection = () => {
		setSearchParams({ ...searchParams, [QueryParams.SELECTED_CARDS]: ''})
	}

	return {
		selectedCardIds,
		addCard,
		removeCard,
		resetSelection
	}
}
