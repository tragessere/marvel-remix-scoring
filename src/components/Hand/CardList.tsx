import { FunctionComponent } from 'react'
import { cardList } from '../../constants/cardList.ts'
import { useCardSelection } from '../../hooks/useCardSelection.ts'

import './hand.css'
import { scoreHand } from '../../utils/score.ts'
import { SimpleCard } from './SimpleCard.tsx'

export const HandCardList: FunctionComponent = () => {
	const { selectedCardIds } = useCardSelection()
	const hasSelectedCards = selectedCardIds.length !== 0

	const hand = selectedCardIds.map(id => cardList[id])
	const result = scoreHand(hand)

	return (
		<>
			{result && <span>Score: {result.score}</span>}
			<h2>Selected Cards</h2>
			{hasSelectedCards ? (
				selectedCardIds.map(id => <SimpleCard key={id} cardId={id} />)
			) : (
				<p>Use the sidebar to select the cards in your hand</p>
			)}
		</>
	)
}
