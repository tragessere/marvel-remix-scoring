import { FunctionComponent } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { TAG } from '../../types/card.ts'
import { TagIcon } from './TagIcon.tsx'

interface CardTextProps {
	i18nKey: string
}

export const CardText: FunctionComponent<CardTextProps> = ({ i18nKey }) => {
	const { t } = useTranslation('card-info')
	return (
		<div className="card-text">
			<Trans
				i18nKey={i18nKey}
				components={{
					score: <span className="score" />,
					'score-negative': <span className="score-negative" />,
					name: <span className="name" />,
					hero: <span className="category hero">{t('category.hero')}</span>,
					ally: <span className="category ally">{t('category.ally')}</span>,
					condition: <span className="category condition">{t('category.condition')}</span>,
					equipment: <span className="category equipment">{t('category.equipment')}</span>,
					location: <span className="category location">{t('category.location')}</span>,
					maneuver: <span className="category maneuver">{t('category.maneuver')}</span>,
					villain: <span className="category villain">{t('category.villain')}</span>,
					tech: <TagIcon tag={TAG.TECH} />,
					intel: <TagIcon tag={TAG.INTEL} />,
					strength: <TagIcon tag={TAG.STRENGTH} />,
					agility: <TagIcon tag={TAG.AGILITY} />,
					flight: <TagIcon tag={TAG.FLIGHT} />,
					range: <TagIcon tag={TAG.RANGE} />,
					wakanda: <TagIcon tag={TAG.WAKANDA} />,
					asgard: <TagIcon tag={TAG.ASGARD} />,
					mutant: <TagIcon tag={TAG.MUTANT} />,
					gamma: <TagIcon tag={TAG.GAMMA} />,
					worthy: <TagIcon tag={TAG.WORTHY} />,
					urban: <TagIcon tag={TAG.URBAN} />,
					boss: <TagIcon tag={TAG.BOSS} />
				}}
			/>
		</div>
	)
}
