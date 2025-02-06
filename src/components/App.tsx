import { CardSelectionModeProvider } from '../contexts/CardSelectionModeProvider.tsx'
import { HandCardList } from './Hand/CardList.tsx'
import { Header } from './Header/Header.tsx'
import { ScoreProvider } from '../contexts/ScoreProvider.tsx'
import { SelectCategories } from './Select/Categories.tsx'

import './App.css'

function App() {
	return (
		<CardSelectionModeProvider>
			<ScoreProvider>
				<Header />
				<div className="content">
					<section className="column-select">
						<h2 className="sr-only">Select Cards</h2>
						<SelectCategories />
					</section>
					<main>
						<HandCardList />
					</main>
				</div>
			</ScoreProvider>
		</CardSelectionModeProvider>
	)
}

export default App
