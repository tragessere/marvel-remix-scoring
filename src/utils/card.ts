import { Card, ModifiedCard, TAG } from '../types/card.ts'

export const sortEffectCardsFirst = (a: Card, b: Card) => {
	if (!!a.effect === !!b.effect) {
		return 0
	}
	if (a.effect) {
		return -1
	}
	return 1
}

export const findCard = <T extends Card>(hand: T[], id: number) => {
	return hand.find(card => card.id === id) as T
}

export const removeTag = (card: ModifiedCard, tag: TAG, count: number = 1) => {
	let deletedCount = 0
	const finalTags = card.modifiedTags.reduce<TAG[]>((acc, t) => {
		if (t === tag && deletedCount < count) {
			deletedCount++
			return acc
		}
		acc.push(t)
		return acc
	}, [])
	if (deletedCount < count) {
		throw new Error('Not enough tags to remove')
	}
	card.modifiedTags = finalTags
}

export const mapCardTags = (card: ModifiedCard) => {
	const addedTags = card.modifiedTags.slice().sort((a, b) => a - b)
	const originalTagList = card.isTransformed && card.transformedTags ? card.transformedTags : card.tags
	const tags = originalTagList.map(t => ({ tag: t, isDeleted: false }))
	for (const tag of tags) {
		const resultIndex = addedTags.indexOf(tag.tag)
		if (resultIndex > -1) {
			addedTags.splice(resultIndex, 1)
		} else {
			tag.isDeleted = true
		}
	}

	return [tags, addedTags] as const
}
