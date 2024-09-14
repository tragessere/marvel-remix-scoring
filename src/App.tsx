import { useSearchParams } from 'react-router-dom'
import './App.css'
import { Header } from './components/Header.tsx'

function App() {
	const [queryParams] = useSearchParams({ selectedCards: [] })
	const isScoring = queryParams.get('scoring') === 'true'

	return (
		<>
			<Header />
			{!isScoring && (
				<div>
					<section>
						<h2>Select Cards</h2>
					</section>
				</div>
			)}
		</>
	)
}

export default App
