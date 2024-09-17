import { FunctionComponent } from 'react'
import { useCardSelection } from '../../hooks/useCardSelection.ts'

import './hand.css'
import { SimpleCard } from './SimpleCard.tsx'


export const HandCardList: FunctionComponent = () => {
	const { selectedCardIds } = useCardSelection()

	return (
		<>
			{selectedCardIds.map(id => (
				<SimpleCard key={id} cardId={id} />
			))}
		</>
	)
}
