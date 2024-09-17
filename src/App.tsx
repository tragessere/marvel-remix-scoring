import { useSearchParams } from 'react-router-dom'
import './App.css'
import { HandCardList } from './components/Hand/CardList.tsx'
import { Header } from './components/Header/Header.tsx'
import { SelectCategories } from './components/Select/Categories.tsx'
import { QueryParams } from './types/route.ts'

function App() {
	const [queryParams] = useSearchParams({ selectedCards: [] })
	const isScoring = queryParams.get('scoring') === 'true'
	const hasSelectedCards = queryParams.get(QueryParams.SELECTED_CARDS)?.length !== 0

	return (
		<>
			<Header />
			<div className="content">
				{!isScoring && (
					<section className="column-select">
						<h2 className="sr-only">Select Cards</h2>
						<SelectCategories />
					</section>
				)}
				<main className={isScoring ? 'full-width' : ''}>
					<h2>Selected Cards</h2>
					{hasSelectedCards ? (
							<HandCardList />
					) : (
						<p>Use the sidebar to select the cards in your hand</p>
					)}
				</main>
			</div>
		</>
	)
}

export default App
