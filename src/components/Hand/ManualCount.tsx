import { FunctionComponent } from 'react'
import { useCardSelection } from '../../hooks/useCardSelection.ts'

export interface ManualCountProps {
	/** Card whose score depends on a count that can't be read from the hand, such as Moondragon */
	sourceCardId: number
	label: string
}

export const ManualCount: FunctionComponent<ManualCountProps> = ({ sourceCardId, label }) => {
	const { getManualInput, setManualInput } = useCardSelection()
	const manualInput = getManualInput(sourceCardId)

	return (
		<label
			className="manual-input"
			onClick={event => {
				event.stopPropagation()
			}}>
			{label}
			<input
				type="number"
				min={0}
				step={1}
				inputMode="numeric"
				value={manualInput?.value ?? ''}
				onChange={event => {
					const { value } = event.target
					if (value === '') {
						setManualInput(sourceCardId, undefined)
						return
					}

					const count = Number(value)
					if (Number.isInteger(count) && count >= 0) {
						setManualInput(sourceCardId, count)
					}
				}}
			/>
		</label>
	)
}
