import { ActiveCardSelectionProvider } from '../contexts/ActiveCardSelectionProvider.tsx'
import { HandCardList } from './Hand/CardList.tsx'
import { Header } from './Header/Header.tsx'
import { ScoreProvider } from '../contexts/ScoreProvider.tsx'
import { SelectCategories } from './Select/Categories.tsx'

import './App.css'

function App() {
	return (
		<>
			<Header />
			<div className="content">
				<ActiveCardSelectionProvider>
					<section className="column-select">
						<h2 className="sr-only">Select Cards</h2>
						<SelectCategories />
					</section>
					<main>
						<ScoreProvider>
							<HandCardList />
						</ScoreProvider>
					</main>
				</ActiveCardSelectionProvider>
			</div>
		</>
	)
}

export default App
