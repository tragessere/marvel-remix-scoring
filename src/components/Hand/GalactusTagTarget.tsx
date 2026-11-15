import { FunctionComponent, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { ScoreContext } from '../../contexts/ContextList.tsx'
import { useCardSelection } from '../../hooks/useCardSelection.ts'
import { countGalactusTags } from '../../utils/card.ts'

const GALACTUS_ID = 147

/** Show how many different tags count for Galactus, or choose between keeping more tags and scoring more points */
export const GalactusTagTarget: FunctionComponent = () => {
	const { t } = useTranslation('card-info')
	const { getManualInput, setManualInput } = useCardSelection()
	const { finalHand, galactusOptions } = useContext(ScoreContext)
	const manualInput = getManualInput(GALACTUS_ID)

	const tagCount = countGalactusTags(finalHand)

	if (galactusOptions.length < 2) {
		return (
			<div className="manual-input-container">
				<span className="manual-input">{t(`${GALACTUS_ID}.tag-count`, { tagCount })}</span>
			</div>
		)
	}

	return (
		<div className="manual-input-container">
			<label
				className="manual-input"
				onClick={event => {
					event.stopPropagation()
				}}>
				{t(`${GALACTUS_ID}.tag-target-label`)}
				<select
					value={tagCount}
					onChange={event => {
						// Keep the "most different tags" answer, which shares this card's manual input
						setManualInput(GALACTUS_ID, manualInput?.value ?? 0, Number(event.target.value))
					}}>
					{galactusOptions.map(({ tagCount, score }) => (
						<option key={tagCount} value={tagCount}>
							{t(`${GALACTUS_ID}.tag-target-option`, { tagCount, score })}
						</option>
					))}
				</select>
			</label>
		</div>
	)
}
