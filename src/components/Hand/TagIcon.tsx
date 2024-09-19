import { FunctionComponent } from 'react'
import { TAG } from '../../types/card.ts'

interface TagIconProps {
	tag: TAG
}

export const TagIcon: FunctionComponent<TagIconProps> = ({ tag }) => {
	return <span className="tag">[{TAG[tag].toLowerCase()}]</span>
}
