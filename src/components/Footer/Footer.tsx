import { FunctionComponent } from 'react'
import { useTranslation } from 'react-i18next'

export const Footer: FunctionComponent = () => {
	const { t } = useTranslation()
	return (
		<div className="footer">
			<div className="spacer" />
			<p>{t('disclaimer')}</p>
		</div>
	)
}
