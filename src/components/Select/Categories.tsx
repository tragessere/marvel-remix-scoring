import { groupBy, map, sortBy } from 'lodash'
import { FunctionComponent, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cardList } from '../../constants/cardList.ts'
import { CARD_SELECT_MODE, CardSelectionModeContext } from '../../contexts/ContextList.tsx'
import { CARD_TYPE } from '../../types/card.ts'
import { SelectCardCategory } from './CardCategory.tsx'

import './select.css'

export const SelectCategories: FunctionComponent = () => {
	const { t } = useTranslation('card-info', { keyPrefix: 'category' })
	const cardGroups = groupBy(cardList, 'type')
	// Create list of categories using the keys of the CARD_TYPE enum
	const categories = sortBy(
		map(Object.keys(cardGroups), k => CARD_TYPE[Number(k)] as keyof typeof CARD_TYPE),
		c => t(c.toLowerCase())
	)

	const { cardSelectMode } = useContext(CardSelectionModeContext)
	const [expandedCategory, setExpandedCategory] = useState<CARD_TYPE | undefined>()

	const onCategoryClick = (category: CARD_TYPE) => {
		if (category === expandedCategory) {
			setExpandedCategory(undefined)
		} else {
			setExpandedCategory(category)
		}
	}

	return (
		<div className={cardSelectMode === CARD_SELECT_MODE.DEFAULT ? '' : 'alternate-selection-mode'}>
			{categories.map(c => (
				<SelectCardCategory
					key={c}
					cards={cardGroups[CARD_TYPE[c]]}
					onClick={onCategoryClick}
					isExpanded={expandedCategory === CARD_TYPE[c]}
				/>
			))}
		</div>
	)
}
