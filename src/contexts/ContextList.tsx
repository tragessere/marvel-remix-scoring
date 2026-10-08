import { createContext } from 'react'
import { ScoreResult } from '../utils/score.ts'
import { DECK } from '../types/card.ts'

export enum CARD_SELECT_MODE {
	DEFAULT,
	LOKI_DRAW,
	MIND_STONE_CHOICE
}

export interface ActiveCardSelection {
	cardSelectMode: CARD_SELECT_MODE
	setCardSelectMode: (mode: CARD_SELECT_MODE) => void
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const CardSelectionModeContext = createContext<ActiveCardSelection>(undefined!)

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const ScoreContext = createContext<ScoreResult>(undefined!)

export interface DeckSelection {
	selectedDecks: DECK[]
	toggleDeck: (deck: DECK) => void
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const DeckSelectionContext = createContext<DeckSelection>(undefined!)
