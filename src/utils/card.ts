import sumBy from 'lodash-es/sumBy'
import { Card, CARD_TYPE, DECK, MAGIC_REPLACEMENT_TAGS, ModifiedCard, TAG } from '../types/card.ts'
import { count } from './whyIsThisNotInLodash.ts'

/** Sort cards with a built-in MAGIC tag first, then other cards with effects, then everything else */
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

/** Whether the Mind Stone can count this card from an opponent's hand */
export const isMindStoneTarget = (card: Card) => card.type === CARD_TYPE.HERO || card.type === CARD_TYPE.ALLY

/** Number of INTEL and GUARDIAN tags in the hand */
export const countIntelAndGuardianTags = (hand: ModifiedCard[]) =>
	sumBy(hand, card => count(card.modifiedTags, tag => tag === TAG.INTEL || tag === TAG.GUARDIAN))

export const blankCard = (card: ModifiedCard) => {
	card.isBlanked = true
	card.isBlankedByOtherCard = true
}

/** Number of ways a copied tag can be added. A copied MAGIC tag can count as any other tag. */
export const tagCopyOptionCount = (tag: TAG) => (tag === TAG.MAGIC ? MAGIC_REPLACEMENT_TAGS.length : 1)

/** Number of ways all tags on a card can be duplicated, with each duplicated MAGIC tag counting as any other tag */
export const magicDuplicateOptionCount = (card: ModifiedCard) =>
	card.modifiedTags.reduce((total, tag) => total * tagCopyOptionCount(tag), 1)

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
	const addedTags = card.modifiedTags.toSorted((a, b) => a - b)
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

const COSMOS_DECK_ID_START = 81

/** The deck a card was printed in. Squirrel Girl counts as Marvel Remix, though she can be played with either deck. */
export const getCardDeck = (card: Card) => (card.id >= COSMOS_DECK_ID_START ? DECK.COSMOS : DECK.REMIX)

const DEFAULT_HAND_SIZE = 7
const COMBINED_DECKS_HAND_SIZE = 8

/** Hand size before any card effects. Playing with both decks combined allows an extra card. */
export const getBaseHandSize = (decks: DECK[]) => (decks.length === 2 ? COMBINED_DECKS_HAND_SIZE : DEFAULT_HAND_SIZE)

/** Cosmic cards don't count against the hand limit, so each one raises the max hand size by one */
export const getMaxHandSize = (hand: Card[], baseHandSize: number) =>
	baseHandSize + hand.filter(card => card.tags.includes(TAG.COSMIC)).length

/** Whether a card belongs to any of the given decks */
export const isCardInDecks = (card: Card, decks: DECK[]) => {
	// Always include Squirrel Girl
	if (card.id === 80) {
		return decks.length > 0
	}
	return decks.includes(getCardDeck(card))
}
