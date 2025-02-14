import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { cardList } from '../../constants/cardList.ts'
import { CARD_SELECT_MODE, CardSelectionModeContext } from '../../contexts/ContextList.tsx'
import { useCardSelection } from '../../hooks/useCardSelection.ts'
import { CARD_TYPE } from '../../types/card.ts'

export const LokiDrawnCard = () => {
	const { t } = useTranslation('card-info')
	const { lokiCardId, setLokiDraw } = useCardSelection()
	const { cardSelectMode, setCardSelectMode } = useContext(CardSelectionModeContext)

	const card = lokiCardId ? cardList[lokiCardId] : undefined
	const category = card ? CARD_TYPE[card.type].toLowerCase() : ''

	return (
		<>
			{card ? (
				<div
					className={`loki-card card-top-border bg-color-${category}`}
					onClick={event => {
						setCardSelectMode(CARD_SELECT_MODE.DEFAULT)
						setLokiDraw(undefined)
						event.stopPropagation()
					}}>
					<span className="base-power">{card.power}</span>
					<span className="name">{t(`${card.id}.name`)}</span>
				</div>
			) : (
				<button
					className="active-card-use"
					onClick={event => {
						if (cardSelectMode === CARD_SELECT_MODE.DEFAULT) {
							setCardSelectMode(CARD_SELECT_MODE.LOKI_DRAW)
						} else {
							setCardSelectMode(CARD_SELECT_MODE.DEFAULT)
						}
						event.stopPropagation()
					}}>
					{cardSelectMode !== CARD_SELECT_MODE.LOKI_DRAW ? 'Draw a card' : 'Cancel'}
				</button>
			)}
		</>
	)
}
