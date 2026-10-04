import { FunctionComponent } from 'react'
import { useCardSelection } from '../../hooks/useCardSelection.ts'

export interface ManualToggleProps {
	/** Card whose score depends on a yes/no condition that can't be read from the hand, such as Galactus */
	sourceCardId: number
	label: string
}

export const ManualToggle: FunctionComponent<ManualToggleProps> = ({ sourceCardId, label }) => {
	const { getManualInput, setManualInput } = useCardSelection()
	const manualInput = getManualInput(sourceCardId)

	return (
		<label
			className="manual-input"
			onClick={event => {
				event.stopPropagation()
			}}>
			<input
				type="checkbox"
				checked={manualInput?.value === 1}
				onChange={event => {
					setManualInput(sourceCardId, event.target.checked ? 1 : 0)
				}}
			/>
			{label}
		</label>
	)
}
