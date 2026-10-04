import { FunctionComponent, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { cardList } from '../../constants/cardList.ts'
import { CARD_SELECT_MODE, ScoreContext } from '../../contexts/ContextList.tsx'
import { useCardSelection } from '../../hooks/useCardSelection.ts'
import { CARD_TYPE, MANUAL_INPUT } from '../../types/card.ts'
import { findCard, mapCardTags } from '../../utils/card.ts'
import { CardText } from './CardText.tsx'
import { ChosenCard } from './ChosenCard.tsx'
import { ManualCount } from './ManualCount.tsx'
import { ManualToggle } from './ManualToggle.tsx'
import { TagIcon } from './TagIcon.tsx'

export interface SimpleCardProps {
	cardId: number
}

export const SimpleCard: FunctionComponent<SimpleCardProps> = ({ cardId }) => {
	const { i18n, t } = useTranslation('card-info')
	const { removeCard } = useCardSelection()
	const card = cardList[cardId]
	const category = CARD_TYPE[card.type].toLowerCase()

	const result = useContext(ScoreContext)
	const scoredCard = findCard(result.finalHand, cardId)
	const [tags, addedTags] = mapCardTags(scoredCard)

	const cardNameAccessor = scoredCard.isTransformed ? `${card.id}.modified-name` : `${card.id}.name`

	return (
		<div
			className={`simple-card${scoredCard.isBlanked ? ' blanked' : scoredCard.isTextBlanked ? ' text-blanked' : ''} ${category}`}
			role="button"
			tabIndex={0}
			onClick={() => {
				removeCard(cardId)
			}}>
			<div className={`card-top-border bg-color-${category}${scoredCard.isTransformed ? ' transformed' : ''}`}>
				<span className="base-power">{scoredCard.isBlanked ? '-' : card.power}</span>
				<span className="name outline">{t(cardNameAccessor)}</span>
				{result.score !== undefined && <span className="final-score outline">{scoredCard.modifiedPower}</span>}
			</div>
			<div className="card-content">
				<>
					{tags.length > 0 && (
						<div className="tag-list">
							{tags.map((t, index) => (
								<TagIcon key={index} tag={t.tag} isDeleted={t.isDeleted} />
							))}
							{addedTags.length > 0 && (
								<>
									+
									{addedTags.map((t, index) => (
										<TagIcon key={index} tag={t} />
									))}
								</>
							)}
						</div>
					)}
					{i18n.exists(`card-info:${card.id}.text`) && <CardText i18nKey={`card-info:${card.id}.text`} />}
				</>
				{card.id === 73 && (
					<div className="chosen-card-container">
						<span>Drawn Card:</span>
						<ChosenCard
							sourceCardId={73}
							selectMode={CARD_SELECT_MODE.LOKI_DRAW}
							buttonLabel="Draw a card"
						/>
					</div>
				)}
				{card.id === 104 && (
					<div className="chosen-card-container">
						<span>Opponent's Card:</span>
						<ChosenCard
							sourceCardId={104}
							selectMode={CARD_SELECT_MODE.MIND_STONE_CHOICE}
							buttonLabel="Choose a card"
							shouldAddFullCardToHand
						/>
					</div>
				)}
				{card.manualInput === MANUAL_INPUT.COUNT && (
					<div className="chosen-card-container">
						<ManualCount sourceCardId={card.id} label={t(`${card.id}.input-label`)} />
					</div>
				)}
				{card.manualInput === MANUAL_INPUT.TOGGLE && (
					<div className="chosen-card-container">
						<ManualToggle sourceCardId={card.id} label={t(`${card.id}.input-label`)} />
					</div>
				)}
			</div>
		</div>
	)
}
