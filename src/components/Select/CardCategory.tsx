import { FunctionComponent, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { CSSTransition } from 'react-transition-group'
import { Card, CARD_TYPE } from '../../types/card.ts'
import { SelectCard } from './Card.tsx'

interface SelectCardCategoryProps {
	cards: Card[]
	onClick: (category: CARD_TYPE) => void
	isExpanded: boolean
}

export const SelectCardCategory: FunctionComponent<SelectCardCategoryProps> = ({ cards, isExpanded, onClick }) => {
	const { t } = useTranslation('common', { keyPrefix: 'select-cards' })
	const category = cards[0].type
	const categoryName = CARD_TYPE[category].toLowerCase()
	const nodeRef = useRef(null)

	return (
		<>
			<button
				className={`select-card-category-button ${categoryName}`}
				data-category={categoryName}
				onClick={() => onClick(category)}
				aria-expanded={isExpanded}>
				{t(categoryName)}
			</button>
			<CSSTransition
				nodeRef={nodeRef}
				in={isExpanded}
				timeout={250}
				classNames="category-animated"
				unmountOnExit>
				<div ref={nodeRef} className="select-card-category-wrapper-outer">
					<div className="select-card-category-wrapper-inner">
						{cards.map(c => (
							<SelectCard key={c.id} card={c} />
						))}
					</div>
				</div>
			</CSSTransition>
		</>
	)
}
