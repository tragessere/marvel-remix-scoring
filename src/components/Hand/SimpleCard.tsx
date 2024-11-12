import { FunctionComponent, useContext } from 'react'
import { cardList } from '../../constants/cardList.ts'
import { useCardSelection } from '../../hooks/useCardSelection.ts'
import { CARD_TYPE } from '../../types/card.ts'
import { findCard } from '../../utils/card.ts'
import { ScoreContext } from '../ScoreContext.tsx'
import { TagIcon } from './TagIcon.tsx'

export interface SimpleCardProps {
	cardId: number
}

export const SimpleCard: FunctionComponent<SimpleCardProps> = ({ cardId }) => {
	const { removeCard } = useCardSelection()
	const card = cardList[cardId]
	const category = CARD_TYPE[card.type].toLowerCase()

	const result = useContext(ScoreContext)
	const scoredCard = findCard(result.finalHand, cardId)

	return (
		<div className={`simple-card${scoredCard.isBlanked ? ' blanked' : ''} ${category}`} role="button" tabIndex={0} onClick={() => removeCard(cardId)}>
			<div className={`card-top-border bg-color-${category}`}>
				<span className="base-power">{card.power}</span>
				<span className="name">{card.name}</span>
				{result.score !== 0 && <span className="final-score">{scoredCard.score(result.finalHand)}</span>}
			</div>
			<div>
				<div className="tag-list">{scoredCard.modifiedTags.sort(t => t).map(((t, index) => <TagIcon key={index} tag={t} />))}</div>
				<span>Placeholder</span>
			</div>
		</div>
	)
}
