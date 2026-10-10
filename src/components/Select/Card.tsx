import { FunctionComponent, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { CARD_SELECT_MODE, CardSelectionModeContext, ScoreContext } from '../../contexts/ContextList.tsx'
import { useCardSelection } from '../../hooks/useCardSelection.ts'
import { Card, CARD_TYPE, TAG } from '../../types/card.ts'
import { isMindStoneTarget } from '../../utils/card.ts'

interface SelectCardProps {
	card: Card
}

export const SelectCard: FunctionComponent<SelectCardProps> = ({ card }) => {
	const { t } = useTranslation('card-info')
	const { selectedCardIds, addCard, removeCard, setManualInput } = useCardSelection()
	const { cardSelectMode, setCardSelectMode } = useContext(CardSelectionModeContext)
	const { maxHandSize } = useContext(ScoreContext)

	const category = CARD_TYPE[card.type].toLowerCase()
	const includesCard = selectedCardIds.includes(card.id)
	// A Cosmic card doesn't count against the hand limit, so it can always be added
	const canAddCard = selectedCardIds.length < maxHandSize || card.tags.includes(TAG.COSMIC)
	// Mind Stone can only take a hero or ally from an opponent
	const isDisabled = cardSelectMode === CARD_SELECT_MODE.MIND_STONE_CHOICE && !isMindStoneTarget(card)

	const onClick = () => {
		if (cardSelectMode == CARD_SELECT_MODE.LOKI_DRAW) {
			setManualInput(73, card.id)
			setCardSelectMode(CARD_SELECT_MODE.DEFAULT)
		} else if (cardSelectMode == CARD_SELECT_MODE.MIND_STONE_CHOICE) {
			if (isDisabled) return
			// Transformable cards start untransformed until the player says otherwise
			setManualInput(104, card.id, card.transformedTags ? 0 : undefined)
			setCardSelectMode(CARD_SELECT_MODE.DEFAULT)
		} else if (includesCard) {
			removeCard(card.id)
		} else if (canAddCard) {
			addCard(card.id)
		}
	}

	return (
		<button
			className={`select-card outline bg-color-${category}${includesCard ? ' selected' : ''}`}
			onClick={onClick}
			disabled={isDisabled}
			aria-selected={includesCard}>
			{t(`${card.id}.name`)}
		</button>
	)
}
