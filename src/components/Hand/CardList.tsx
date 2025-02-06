import { FunctionComponent } from 'react'
import { useCardSelection } from '../../hooks/useCardSelection.ts'
import { SimpleCard } from './SimpleCard.tsx'
import './hand.css'

export const HandCardList: FunctionComponent = () => {
	const { selectedCardIds } = useCardSelection()
	const hasSelectedCards = selectedCardIds.length !== 0

	return (
		<>
			<h2>Selected Cards</h2>
			{hasSelectedCards ? (
				selectedCardIds.map(id => <SimpleCard key={id} cardId={id} /> )
			) : (
				<p>Use the sidebar to select the cards in your hand</p>
			)}
		</>
	)
}
