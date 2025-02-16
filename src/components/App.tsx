import { CardSelectionModeProvider } from '../contexts/CardSelectionModeProvider.tsx'
import { HandCardList } from './Hand/CardList.tsx'
import { Header } from './Header/Header.tsx'
import { SelectColumn } from './Select/Column.tsx'
import { ScoreProvider } from '../contexts/ScoreProvider.tsx'

import './App.css'

function App() {
	return (
		<CardSelectionModeProvider>
			<ScoreProvider>
				<Header />
				<div className="content">
					<SelectColumn />
					<main>
						<HandCardList />
					</main>
				</div>
			</ScoreProvider>
		</CardSelectionModeProvider>
	)
}

export default App
