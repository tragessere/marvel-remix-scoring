import { FunctionComponent, ReactNode } from 'react'
import { cardList } from '../constants/cardList.ts'
import { useCardSelection } from '../hooks/useCardSelection.ts'
import { scoreHand } from '../utils/score.ts'
import { ScoreContext } from './ContextList.tsx'

export const ScoreProvider: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
	const { selectedCardIds, lokiCardId } = useCardSelection()
	const hand = selectedCardIds.map(id => cardList[id])
	const lokiPenalty = lokiCardId ? cardList[lokiCardId].power : undefined
	const result = scoreHand(hand, lokiPenalty)

	return <ScoreContext value={result}>{children}</ScoreContext>
}
