import { FunctionComponent, useContext } from 'react'
import { Trans } from 'react-i18next'
import { ScoreContext } from '../../contexts/ContextList.tsx'
import { TAG } from '../../types/card.ts'
import { countIntelAndGuardianTags } from '../../utils/card.ts'
import { TagIcon } from './TagIcon.tsx'

export const TagCount: FunctionComponent = () => {
	const { finalHand } = useContext(ScoreContext)

	return (
		<div className="tag-count">
			<Trans
				i18nKey="common:selected-cards.intel-guardian-count"
				components={{ intel: <TagIcon tag={TAG.INTEL} />, guardian: <TagIcon tag={TAG.GUARDIAN} /> }}></Trans>
			<span className="tag-count-total">{countIntelAndGuardianTags(finalHand)}</span>
		</div>
	)
}
