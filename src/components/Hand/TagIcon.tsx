import { FunctionComponent } from 'react'
import { useTranslation } from 'react-i18next'
import { TAG } from '../../types/card.ts'

interface TagIconProps {
	tag: TAG
}

export const TagIcon: FunctionComponent<TagIconProps> = ({ tag }) => {
	const { t } = useTranslation('card-info')
	const tagKey = TAG[tag].toLowerCase()

	return (
		<i className={`tag mr-${tagKey}`}>
			<span className="sr-only">{t(`tag.${tagKey}`)}</span>
		</i>
	)
}
