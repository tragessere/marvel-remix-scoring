import { FunctionComponent } from 'react'
import { useTranslation } from 'react-i18next'
import { useCardSelection } from '../../hooks/useCardSelection.ts'
import { SimpleCard } from './SimpleCard.tsx'
import './hand.css'

export const HandCardList: FunctionComponent = () => {
	const { t } = useTranslation('common', { keyPrefix: 'selected-cards' })
	const { selectedCardIds } = useCardSelection()
	const hasSelectedCards = selectedCardIds.length !== 0

	return (
		<>
			<h2 className={selectedCardIds.length ? 'sr-only' : ''}>{t('header')}</h2>
			{hasSelectedCards ? (
				selectedCardIds.map(id => <SimpleCard key={id} cardId={id} />)
			) : (
				<p>{t('empty-prompt')}</p>
			)}
		</>
	)
}
