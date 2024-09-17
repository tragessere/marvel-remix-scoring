import { FunctionComponent } from 'react'

import './header.css'
import { useCardSelection } from '../../hooks/useCardSelection.ts'

export const Header: FunctionComponent = () => {
	const { selectedCardIds, resetSelection } = useCardSelection()
	const selectedCardCount = selectedCardIds.length

	return (
		<div className="header">
			<h1>Marvel Remix</h1>
			<div className="right-side">
				<span className="card-count">{selectedCardCount}/7</span>
				<button className="reset" aria-label="reset" onClick={resetSelection}>↻</button>
			</div>
		</div>
	)
}
