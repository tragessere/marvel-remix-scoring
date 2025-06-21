import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import App from './components/App.tsx'

import './i18n.ts'

import './css/index.css'
import './css/font.css'
import './css/variables.css'

import './assets/Marvel-Remix-Icons.woff'

const router = createBrowserRouter([
	{
		path: '/marvel-remix-scoring',
		element: <App />
	},
	{
		path: '*',
		element: <Navigate to="/marvel-remix-scoring" />
	}
])

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Suspense>
			<div className="background">
				<RouterProvider router={router} />
			</div>
		</Suspense>
	</StrictMode>
)
