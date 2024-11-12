import './App.css'
import { HandCardList } from './Hand/CardList.tsx'
import { Header } from './Header/Header.tsx'
import { ScoreProvider } from './ScoreContext.tsx'
import { SelectCategories } from './Select/Categories.tsx'

function App() {
	return (
		<>
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
		</>
	)
}

export default App
