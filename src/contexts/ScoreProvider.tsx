import { FunctionComponent, ReactNode, useContext } from 'react'
import { cardList } from '../constants/cardList.ts'
import { useCardSelection } from '../hooks/useCardSelection.ts'
import { getBaseHandSize } from '../utils/card.ts'
import { scoreHand } from '../utils/score.ts'
import { DeckSelectionContext, ScoreContext } from './ContextList.tsx'

export const ScoreProvider: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
	const { selectedCardIds, getManualInput } = useCardSelection()
	const { selectedDecks } = useContext(DeckSelectionContext)
	const hand = selectedCardIds.map(id => cardList[id])
	const result = scoreHand(hand, getManualInput, getBaseHandSize(selectedDecks))

	return <ScoreContext value={result}>{children}</ScoreContext>
}
