import { createContext } from 'react'
import { ScoreResult } from '../utils/score.ts'

export enum CARD_SELECT_MODE {
	DEFAULT,
	LOKI_DRAW
}

export interface ActiveCardSelection {
	cardSelectMode: CARD_SELECT_MODE
	setCardSelectMode: (mode: CARD_SELECT_MODE) => void
}

export const CardSelectionModeContext = createContext<ActiveCardSelection>(undefined)

export const ScoreContext = createContext<ScoreResult>(undefined)
