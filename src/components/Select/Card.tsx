import { FunctionComponent, useContext } from 'react'
import { CARD_SELECT_MODE, CardSelectionModeContext } from '../../contexts/ContextList.tsx'
import { useCardSelection } from '../../hooks/useCardSelection.ts'
import { Card, CARD_TYPE } from '../../types/card.ts'

interface SelectCardProps {
	card: Card
}

export const SelectCard: FunctionComponent<SelectCardProps> = ({ card }) => {
	const { selectedCardIds, addCard, removeCard, setLokiDraw } = useCardSelection()
	const { cardSelectMode, setCardSelectMode } = useContext(CardSelectionModeContext)

	const category = CARD_TYPE[card.type].toLowerCase()
	const includesCard = selectedCardIds.includes(card.id)
	const canAddCard = selectedCardIds.length < 7

	const onClick = () => {
		if (cardSelectMode == CARD_SELECT_MODE.LOKI_DRAW) {
			setLokiDraw(card.id)
			setCardSelectMode(CARD_SELECT_MODE.DEFAULT)
		} else if (includesCard) {
			removeCard(card.id)
		} else if (!includesCard && canAddCard) {
			addCard(card.id)
		}
	}

	return (
		<button
			className={`select-card bg-color-${category}${includesCard ? ' selected' : ''}`}
			onClick={onClick}
			aria-selected={includesCard}>
			{card.name}
		</button>
	)
}
