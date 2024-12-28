import { useContext } from 'react'
import { cardList } from '../../constants/cardList.ts'
import { ActiveCardSelectionContext } from '../../contexts/ContextList.tsx'
import { useCardSelection } from '../../hooks/useCardSelection.ts'
import { CARD_TYPE } from '../../types/card.ts'

export const LokiDrawnCard = () => {
	const { lokiCardId, setLokiDraw } = useCardSelection()
	const { activeCardId, setActiveCardId } = useContext(ActiveCardSelectionContext)

	const card = lokiCardId ? cardList[lokiCardId] : undefined
	const category = card ? CARD_TYPE[card.type].toLowerCase() : ''

	return (
		<>
			{card ? (
				<div className={`loki-card card-top-border bg-color-${category}`} onClick={event => {
					setActiveCardId(undefined)
					setLokiDraw(undefined)
					event.stopPropagation()
				}}>
					<span className="base-power">{card.power}</span>
					<span className="name">{card.name}</span>
				</div>
			) : (
				<button
					className="active-card-use"
					disabled={/* disable when another card is active */ activeCardId !== undefined && activeCardId !== 73}
					onClick={event => {
						if (activeCardId === undefined) {
							setActiveCardId(73)
						} else {
							setActiveCardId(undefined)
						}
						event.stopPropagation()
					}}>
					{activeCardId !== 73 ? 'Draw a card' : 'Cancel'}
				</button>
			)}
		</>
	)
}
