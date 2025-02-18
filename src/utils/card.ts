import { Card, ModifiedCard, TAG } from '../types/card.ts'

export function sortEffectCardsFirst(a: Card, b: Card) {
	if (!!a.effect === !!b.effect) {
		return 0
	}
	if (a.effect) {
		return -1
	}
	return 1
}

export function findCard<T extends Card>(hand: T[], id: number) {
	return hand.find(card => card.id === id) as T
}

export function removeTag(card: ModifiedCard, tag: TAG, count: number = 1) {
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
