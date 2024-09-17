import { FunctionComponent } from 'react'
import { Card, CARD_TYPE } from '../../types/card.ts'
import { SelectCard } from './Card.tsx'

interface SelectCardCategoryProps {
	cards: Card[]
	onClick: (category: CARD_TYPE) => void
	isExpanded: boolean
}

export const SelectCardCategory: FunctionComponent<SelectCardCategoryProps> = ({ cards, isExpanded, onClick }) => {
	const category = cards[0].type
	const categoryName = CARD_TYPE[category].toLowerCase()

	return (
		<>
			<button
				className={`select-card-category ${categoryName}${isExpanded ? ' expanded' : ''}`}
				data-category={categoryName}
				onClick={() => onClick(category)}
				aria-expanded={isExpanded}>
				{categoryName}
			</button>
			{isExpanded && (
				<div className="select-card-category-container">
					{cards.map(c => (
						<SelectCard key={c.id} card={c} />
					))}
				</div>
			)}
		</>
	)
}
