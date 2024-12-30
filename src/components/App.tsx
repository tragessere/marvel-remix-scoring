import { CardSelectionModeProvider } from '../contexts/CardSelectionModeProvider.tsx'
import { HandCardList } from './Hand/CardList.tsx'
import { Header } from './Header/Header.tsx'
import { ScoreProvider } from '../contexts/ScoreProvider.tsx'
import { SelectCategories } from './Select/Categories.tsx'

import './App.css'

function App() {
	return (
		<CardSelectionModeProvider>
			<Header />
			<div className="content">
				<section className="column-select">
					<h2 className="sr-only">Select Cards</h2>
					<SelectCategories />
				</section>
				<main>
					<ScoreProvider>
						<HandCardList />
					</ScoreProvider>
				</main>
			</div>
		</CardSelectionModeProvider>
	)
}

export default App
