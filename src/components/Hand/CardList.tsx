import { FunctionComponent, useContext } from 'react'
import { useCardSelection } from '../../hooks/useCardSelection.ts'
import { ScoreContext } from '../ScoreContext.tsx'
import { SimpleCard } from './SimpleCard.tsx'
import './hand.css'

export const HandCardList: FunctionComponent = () => {
	const { selectedCardIds } = useCardSelection()
	const hasSelectedCards = selectedCardIds.length !== 0

	const result = useContext(ScoreContext)

	return (
		<>
			{result && <span>Score: {result.score}</span>}
			<h2>Selected Cards</h2>
			{hasSelectedCards ? (
				selectedCardIds.map(id => <SimpleCard key={id} cardId={id} /> )
			) : (
				<p>Use the sidebar to select the cards in your hand</p>
			)}
		</>
	)
}
