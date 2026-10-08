import { FunctionComponent, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { DeckSelectionContext } from '../../contexts/ContextList.tsx'
import { ALL_DECKS, DECK } from '../../types/card.ts'

export const Settings: FunctionComponent = () => {
	const { t } = useTranslation('common', { keyPrefix: 'settings' })
	const { selectedDecks, toggleDeck } = useContext(DeckSelectionContext)

	return (
		<div className="settings">
			<h2>{t('header')}</h2>
			<fieldset className="deck-select">
				<legend>{t('select-decks.header')}</legend>
				{ALL_DECKS.map(deck => (
					<label key={deck}>
						<input
							type="checkbox"
							checked={selectedDecks.includes(deck)}
							onChange={() => {
								toggleDeck(deck)
							}}
						/>
						{t(`select-decks.${DECK[deck].toLowerCase()}`)}
					</label>
				))}
			</fieldset>
		</div>
	)
}
