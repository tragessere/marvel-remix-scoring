import { createContext, FunctionComponent, ReactNode } from 'react'
import { cardList } from '../constants/cardList.ts'
import { useCardSelection } from '../hooks/useCardSelection.ts'
import { scoreHand, ScoreResult } from '../utils/score.ts'

export const ScoreContext = createContext<ScoreResult>(undefined!)

export const ScoreProvider: FunctionComponent<{children: ReactNode}> = ({ children }) => {
	const { selectedCardIds } = useCardSelection()
	const hand = selectedCardIds.map(id => cardList[id])
	const result = scoreHand(hand)

	return <ScoreContext.Provider value={result}>
		{children}
	</ScoreContext.Provider>
}
