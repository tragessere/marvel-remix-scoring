import { FunctionComponent } from 'react'
import { Trans, useTranslation } from 'react-i18next'

interface CardTextProps {
	i18nKey: string
}

export const CardText: FunctionComponent<CardTextProps> = ({ i18nKey }) => {
	const { t } = useTranslation('card-info')
	return (
		<div className="card-text">
			<Trans i18nKey={i18nKey} components={{
				score: <span className="score" />,
				"score-negative": <span className="score-negative" />,
				name: <span className="name" />,
				hero: <span className="category hero">{t('category.hero')}</span>,
				ally: <span className="category ally">{t('category.ally')}</span>,
				condition: <span className="category condition">{t('category.condition')}</span>,
				equipment: <span className="category equipment">{t('category.equipment')}</span>,
				location: <span className="category location">{t('category.location')}</span>,
				maneuver: <span className="category maneuver">{t('category.maneuver')}</span>,
				villain: <span className="category villain">{t('category.villain')}</span>,
				tech: <i className="tag mr-tech"><span className="sr-only">{t('tag.tech')}</span></i>,
				intel: <i className="tag mr-intel"><span className="sr-only">{t('tag-intel')}</span></i>,
				strength: <i className="tag mr-strength"><span className="sr-only">{t('tag.strength')}</span></i>,
				agility: <i className="tag mr-agility"><span className="sr-only">{t('tag.agility')}</span></i>,
				flight: <i className="tag mr-flight"><span className="sr-only">{t('tag.flight')}</span></i>,
				range: <i className="tag mr-range"><span className="sr-only">{t('tag.range')}</span></i>,
				wakanda: <i className="tag mr-wakanda"><span className="sr-only">{t('tag.wakanda')}</span></i>,
				asgard: <i className="tag mr-asgard"><span className="sr-only">{t('tag.asgard')}</span></i>,
				mutant: <i className="tag mr-mutant"><span className="sr-only">{t('tag.mutant')}</span></i>,
				gamma: <i className="tag mr-gamma"><span className="sr-only">{t('tag.gamma')}</span></i>,
				worthy: <i className="tag mr-worthy"><span className="sr-only">{t('tag.worthy')}</span></i>,
				urban: <i className="tag mr-urban"><span className="sr-only">{t('tag.urban')}</span></i>,
				boss: <i className="tag mr-boss"><span className="sr-only">{t('tag.boss')}</span></i>,
			}} />
		</div>
	)
}
