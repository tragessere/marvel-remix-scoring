import { FunctionComponent } from 'react'
import { useTranslation } from 'react-i18next'
import { TAG } from '../../types/card.ts'

interface TagIconProps {
	tag: TAG
	isDeleted?: boolean
}

export const TagIcon: FunctionComponent<TagIconProps> = ({ tag, isDeleted }) => {
	const { t } = useTranslation('card-info')
	const tagKey = TAG[tag].toLowerCase()

	return isDeleted ? (
		<div className="deleted-tag-container">
			<i className={`tag mr-${tagKey}`}>
				<span className="sr-only">
					{t(`tag.${tagKey}`)} {t('deleted')}
				</span>
			</i>
		</div>
	) : (
		<i className={`tag mr-${tagKey}`}>
			<span className="sr-only">{t(`tag.${tagKey}`)}</span>
		</i>
	)
}
