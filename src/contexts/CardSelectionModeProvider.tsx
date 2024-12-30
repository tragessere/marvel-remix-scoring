import { FunctionComponent, ReactNode, useState } from 'react'
import { CardSelectionModeContext, CARD_SELECT_MODE } from './ContextList.tsx'

export const CardSelectionModeProvider: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
	const [cardSelectMode, setCardSelectMode] = useState<CARD_SELECT_MODE>(CARD_SELECT_MODE.DEFAULT)

	return (
		<CardSelectionModeContext value={{ cardSelectMode, setCardSelectMode }}>
			{children}
		</CardSelectionModeContext>
	)
}
