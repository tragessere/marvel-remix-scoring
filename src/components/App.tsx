import { CardSelectionModeProvider } from '../contexts/CardSelectionModeProvider.tsx'
import { DeckSelectionProvider } from '../contexts/DeckSelectionProvider.tsx'
import { Footer } from './Footer/Footer.tsx'
import { HandCardList } from './Hand/CardList.tsx'
import { Header } from './Header/Header.tsx'
import { SelectColumn } from './Select/Column.tsx'
import { ScoreProvider } from '../contexts/ScoreProvider.tsx'

import './App.css'

function App() {
	return (
		<CardSelectionModeProvider>
			<ScoreProvider>
				<DeckSelectionProvider>
					<Header />
					<div className="content">
						<SelectColumn />
						<main>
							<HandCardList />
						</main>
					</div>
					<Footer />
				</DeckSelectionProvider>
			</ScoreProvider>
		</CardSelectionModeProvider>
	)
}

export default App
