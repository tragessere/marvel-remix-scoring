import { createContext } from 'react'
import { ScoreResult } from '../utils/score.ts'

export interface ActiveCardSelection {
	activeCardId: number | undefined
	setActiveCardId: (id: number | undefined) => void
}

export const ActiveCardSelectionContext = createContext<ActiveCardSelection>(undefined!)

export const ScoreContext = createContext<ScoreResult>(undefined!)
