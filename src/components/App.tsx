import './App.css'
import { HandCardList } from './Hand/CardList.tsx'
import { Header } from './Header/Header.tsx'
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
					<HandCardList />
				</main>
			</div>
		</>
	)
}

export default App
