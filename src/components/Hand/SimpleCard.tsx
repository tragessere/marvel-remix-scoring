import { FunctionComponent } from 'react'
import { cardList } from '../../constants/cardList.ts'
import { useCardSelection } from '../../hooks/useCardSelection.ts'
import { CARD_TYPE } from '../../types/card.ts'
import { TagIcon } from './TagIcon.tsx'

export interface SimpleCardProps {
	cardId: number
}

export const SimpleCard: FunctionComponent<SimpleCardProps> = ({ cardId }) => {
	const { removeCard } = useCardSelection()
	const card = cardList[cardId]
	const category = CARD_TYPE[card.type].toLowerCase()

	return (
		<div className={`simple-card ${category}`} role="button" tabIndex={0} onClick={() => removeCard(cardId)}>
			<div className={`card-top-border bg-color-${category}`}>
				<span className="base-power">{card.power}</span>
				<span className="name">{card.name}</span>
			</div>
			<div>
				<div className="tag-list">{card.tags.map(((t, index) => <TagIcon key={index} tag={t} />))}</div>
				<span>Placeholder</span>
			</div>
		</div>
	)
}
