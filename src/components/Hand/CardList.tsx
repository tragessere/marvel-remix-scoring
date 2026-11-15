import { FunctionComponent, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { DeckSelectionContext } from '../../contexts/ContextList.tsx'
import { useCardSelection } from '../../hooks/useCardSelection.ts'
import { DECK } from '../../types/card.ts'
import { Settings } from './Settings.tsx'
import { SimpleCard } from './SimpleCard.tsx'
import { TagCount } from './TagCount.tsx'
import './hand.css'

export const HandCardList: FunctionComponent = () => {
	const { t } = useTranslation('common', { keyPrefix: 'selected-cards' })
	const { selectedCardIds } = useCardSelection()
	const { selectedDecks } = useContext(DeckSelectionContext)
	const hasSelectedCards = selectedCardIds.length !== 0

	return (
		<>
			{!hasSelectedCards && <Settings />}
			<h2 className={selectedCardIds.length ? 'sr-only' : ''}>{t('header')}</h2>
			{hasSelectedCards ? (
				<>
					{selectedDecks.includes(DECK.COSMOS) && <TagCount />}
					{selectedCardIds.map(id => (
						<SimpleCard key={id} cardId={id} />
					))}
				</>
			) : (
				<p>{t('empty-prompt')}</p>
			)}
		</>
	)
}
