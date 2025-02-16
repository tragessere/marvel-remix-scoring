import { useContext } from 'react'
import { CARD_SELECT_MODE, CardSelectionModeContext } from '../../contexts/ContextList.tsx'
import { SelectCategories } from './Categories.tsx'

export const SelectColumn = () => {
	const { cardSelectMode } = useContext(CardSelectionModeContext)

	return (
		<section className={`column-select ${cardSelectMode === CARD_SELECT_MODE.DEFAULT ? '' : 'alternate-selection-mode'}`}>
			<h2 className="sr-only">Select Cards</h2>
			<SelectCategories />
		</section>
	)
}

