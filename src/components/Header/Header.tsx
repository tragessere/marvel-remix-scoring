import { FunctionComponent, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { ScoreContext } from '../../contexts/ContextList.tsx'
import { useCardSelection } from '../../hooks/useCardSelection.ts'

import './header.css'

export const Header: FunctionComponent = () => {
	const { t } = useTranslation('common', { keyPrefix: 'header' })
	const { selectedCardIds, resetSelection } = useCardSelection()
	const selectedCardCount = selectedCardIds.length

	const result = useContext(ScoreContext)

	return (
		<div className="header">
			<h1>Marvel Remix</h1>
			<div className="right-side">
				<span className="card-count">{selectedCardCount}/7</span>
				<span className="score">{result.score === undefined ? '-' : result.score}</span>
				<button className="reset" aria-label={t('reset')} onClick={resetSelection}>↻</button>
			</div>
		</div>
	)
}
