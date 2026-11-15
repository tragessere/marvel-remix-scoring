import { FunctionComponent, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { cardList } from '../../constants/cardList.ts'
import { CARD_SELECT_MODE, CardSelectionModeContext, ScoreContext } from '../../contexts/ContextList.tsx'
import { useCardSelection } from '../../hooks/useCardSelection.ts'
import { CARD_TYPE, TAG } from '../../types/card.ts'
import { findCard, mapCardTags } from '../../utils/card.ts'
import { TagIcon } from './TagIcon.tsx'

export interface ChosenCardProps {
	/** Card whose effect chooses another card, such as Loki or the Mind Stone */
	sourceCardId: number
	selectMode: CARD_SELECT_MODE
	buttonLabel: string
	/** Whether the chosen card counts as a full card in the hand, with its own tags, transformation, and score */
	shouldAddFullCardToHand?: boolean
}

export const ChosenCard: FunctionComponent<ChosenCardProps> = ({
	sourceCardId,
	selectMode,
	buttonLabel,
	shouldAddFullCardToHand = false
}) => {
	const { t } = useTranslation('card-info')
	const { getManualInput, setManualInput } = useCardSelection()
	const { cardSelectMode, setCardSelectMode } = useContext(CardSelectionModeContext)

	const manualInput = getManualInput(sourceCardId)
	const card = manualInput ? cardList[manualInput.value] : undefined
	const category = card ? CARD_TYPE[card.type].toLowerCase() : ''
	const canTransform = shouldAddFullCardToHand && !!card?.transformedTags
	const isTransformed = canTransform && manualInput?.secondaryValue === 1

	// Get the source card's scored info to check if it is blanked, and the chosen card's scored info if it was counted
	const result = useContext(ScoreContext)
	const scoredCard = findCard(result.finalHand, sourceCardId)
	const scoredChosenCard = card && shouldAddFullCardToHand ? findCard(result.finalHand, card.id) : undefined

	const isEffectBlanked = scoredCard.isBlanked || scoredCard.isTextBlanked

	// Use the scored tags once the chosen card has been scored, otherwise fall back to its printed tags
	const printedTags = (isTransformed ? card.transformedTags : card?.tags) ?? []
	const [tags, addedTags] = scoredChosenCard
		? mapCardTags(scoredChosenCard)
		: ([printedTags.map(tag => ({ tag, isDeleted: false })), [] as TAG[]] as const)

	return (
		<>
			{card ? (
				<>
					<div
						className={`chosen-card${isEffectBlanked ? ' blanked' : ''}`}
						role="button"
						tabIndex={0}
						onClick={event => {
							setCardSelectMode(CARD_SELECT_MODE.DEFAULT)
							setManualInput(sourceCardId, undefined)
							event.stopPropagation()
						}}>
						<div className={`card-top-border bg-color-${category}${isTransformed ? ' transformed' : ''}`}>
							<span className="base-power">{isTransformed ? card.transformedPower : card.power}</span>
							<span className="name outline">
								{t(isTransformed ? `${card.id}.modified-name` : `${card.id}.name`)}
							</span>
							{result.score !== undefined && scoredChosenCard && (
								<span className="final-score outline">{scoredChosenCard.modifiedPower}</span>
							)}
						</div>
						{shouldAddFullCardToHand && tags.length > 0 && (
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
					</div>
					{canTransform && (
						<label
							className="transform-toggle"
							onClick={event => {
								event.stopPropagation()
							}}>
							<input
								type="checkbox"
								checked={isTransformed}
								onChange={event => {
									setManualInput(sourceCardId, card.id, event.target.checked ? 1 : 0)
								}}
							/>
							Transformed
						</label>
					)}
				</>
			) : (
				<button
					className={`active-card-use${isEffectBlanked ? ' blanked' : ''}`}
					onClick={event => {
						setCardSelectMode(cardSelectMode === selectMode ? CARD_SELECT_MODE.DEFAULT : selectMode)
						event.stopPropagation()
					}}>
					{cardSelectMode !== selectMode ? buttonLabel : 'Cancel'}
				</button>
			)}
		</>
	)
}
