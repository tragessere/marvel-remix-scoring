import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './components/App.tsx'

import './i18n.ts'

import './css/index.css'
import './css/font.css'
import './css/variables.css'

import './assets/Marvel-Remix-Icons.woff'

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />
	}
])

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<React.Suspense>
			<div className="background">
				<RouterProvider router={router} />
			</div>
		</React.Suspense>
	</React.StrictMode>
)
