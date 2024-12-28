import { FunctionComponent, ReactNode, useState } from 'react'
import { ActiveCardSelectionContext } from './ContextList.tsx'

export const ActiveCardSelectionProvider: FunctionComponent<{children: ReactNode}> = ({ children }) => {
	const [activeCardId, setActiveCardId] = useState<number | undefined>(undefined)

	return <ActiveCardSelectionContext value={{ activeCardId, setActiveCardId }}>
		{children}
	</ActiveCardSelectionContext>
}
