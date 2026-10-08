import { FunctionComponent, ReactNode, useState } from 'react'
import { cardList } from '../constants/cardList.ts'
import { useCardSelection } from '../hooks/useCardSelection.ts'
import { ALL_DECKS, Card, DECK } from '../types/card.ts'
import { getCardDeck, isCardInDecks } from '../utils/card.ts'
import { DeckSelectionContext } from './ContextList.tsx'

const STORAGE_KEY = 'selectedDecks'

const loadSelectedDecks = (): DECK[] => {
	try {
		const stored = localStorage.getItem(STORAGE_KEY)
		if (stored) {
			const parsed: unknown = JSON.parse(stored)
			if (Array.isArray(parsed)) {
				return ALL_DECKS.filter(deck => parsed.includes(deck))
			}
		}
	} catch {
		// Fall back to the default deck if storage is unavailable or corrupt
	}
	return [DECK.REMIX]
}

/** Add the decks of any selected cards that the given decks don't already include, such as when opening a shared link */
const includeSelectedCardDecks = (decks: DECK[], selectedCardIds: number[]) => {
	const missingDecks = selectedCardIds.flatMap(id => {
		const card = cardList[id] as Card | undefined
		return card && !isCardInDecks(card, decks) ? [getCardDeck(card)] : []
	})
	return ALL_DECKS.filter(deck => decks.includes(deck) || missingDecks.includes(deck))
}

export const DeckSelectionProvider: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
	const { selectedCardIds } = useCardSelection()
	const [selectedDecks, setSelectedDecks] = useState<DECK[]>(() =>
		includeSelectedCardDecks(loadSelectedDecks(), selectedCardIds)
	)

	const toggleDeck = (deck: DECK) => {
		const updatedDecks = selectedDecks.includes(deck)
			? selectedDecks.filter(d => d !== deck)
			: ALL_DECKS.filter(d => d === deck || selectedDecks.includes(d))
		setSelectedDecks(updatedDecks)
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDecks))
		} catch {
			// Selection still works for this session without storage
		}
	}

	return <DeckSelectionContext value={{ selectedDecks, toggleDeck }}>{children}</DeckSelectionContext>
}
