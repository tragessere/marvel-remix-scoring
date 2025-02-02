import cloneDeep from 'lodash/cloneDeep'
import sumBy from 'lodash/sumBy'
import { Card, CARD_TYPE, ModifiedCard } from '../types/card.ts'
import { findCard, sortEffectCardsFirst } from './card.ts'
import { generatePermutations } from './randomization.ts'

export interface ScoreResult {
	score: number
	message: string
	finalHand: ModifiedCard[]
}

/**
 * Calculate the score of the hand of cards. Attempts all combinations of card effects to find the max score and the
 * optimal hand that gives the score.
 *
 * @param hand Array of cards in the player's hand
 * @param lokiPenalty Power of the card drawn at the end from Loki's effect
 */
export const scoreHand = (hand: Card[], lokiPenalty?: number): ScoreResult => {
	const initialHand = hand.map(card => {
		return {
			...card,
			isBlanked: false,
			isTextBlanked: false,
			modifiedName: card.name,
			modifiedPower: card.power,
			modifiedTags: card.tags.slice()
		}
	})

	const { containsVillain, containsHeroOrAlly } = hand.reduce((acc, card) => {
		if (card.type === CARD_TYPE.VILLAIN) acc.containsVillain = true
		else if (card.type === CARD_TYPE.HERO || card.type === CARD_TYPE.ALLY) acc.containsHeroOrAlly = true
		return acc
	}, { containsVillain: false, containsHeroOrAlly: false })
	if (hand.length !== 7 || !containsVillain || !containsHeroOrAlly) {
		return {
			score: 0,
			message: 'Invalid hand',
			finalHand: initialHand
		}
	}

	initialHand.sort(sortEffectCardsFirst)
	const modifyCardCount = initialHand.filter(card => !!card.effect).length
	const modifyCards = initialHand.slice(0, modifyCardCount)
	const countCards = initialHand.slice(modifyCardCount)
	const orderCombinations = generatePermutations(modifyCardCount)

	let maxScore = 0
	let optimalHand: ModifiedCard[] = []
	for (const order of orderCombinations) {
		const orderedHand = order.map(index => modifyCards[index]).concat(countCards)
		const modifiedHand = cloneDeep(orderedHand)
		try {
			const { score, hand: resultHand } = applyEffectsRecursive(modifiedHand, 0)
			if (!!score && score > maxScore) {
				maxScore = score
				optimalHand = resultHand
			}
		} catch (e) { /* invalid order of operation, skip hand */ }
	}

	return {
		score: maxScore - (lokiPenalty || 0),
		message: 'Success',
		finalHand: optimalHand
	}
}

interface Result {
	score: number
	hand: ModifiedCard[]
}

const applyEffectsRecursive = (hand: ModifiedCard[], index: number): Result => {
	if (index === hand.length) {
		if (!containsRequiredCards(hand)) {
			return {
				score: 0, hand
			}
		}
		for (const card of hand) {
			if (card.isBlanked) {
				card.modifiedPower = 0
				card.modifiedTags = []
			} else if (!card.isTextBlanked) {
				card.modifiedPower = card.score(hand)
			}
		}
		return { score: sumBy(hand, card => card.modifiedPower), hand }
	}

	if (index === 0) {
		hand.forEach(card => card.transform?.(hand))
	}

	const currentCard = hand[index]
	if (!currentCard.isBlanked && !currentCard.isTextBlanked && currentCard.modificationOptions && currentCard.effect) {
		const optionCount = currentCard.modificationOptions(hand)
		if (!optionCount) {
			return applyEffectsRecursive(hand, index + 1)
		}
		let optimalHand: ModifiedCard[] = []
		let optimalScore = 0
		for (let i = 0; i < optionCount; i++) {
			const modifiedHand = cloneDeep(hand)
			const clonedCurrentCard = findCard(modifiedHand, currentCard.id)
			const unblankedHand = modifiedHand.filter(card => !card.isBlanked)
			// Use null-safe access to make Typescript happy. `effect` function will always exist here because it
			// was checked on the card before cloning.
			clonedCurrentCard.effect?.(unblankedHand, i)
			modifiedHand.forEach(card => card.transform?.(unblankedHand))
			const { score, hand: resultHand } = applyEffectsRecursive(modifiedHand, index + 1)
			if (score > optimalScore) {
				optimalScore = score
				optimalHand = resultHand
			}
		}
		return { score: optimalScore, hand: optimalHand }
	} else {
		return applyEffectsRecursive(hand, index + 1)
	}
}

const containsRequiredCards = (hand: ModifiedCard[]): boolean => {
	const { containsVillain, containsHeroOrAlly } = hand.reduce((acc, card) => {
		if (card.type === CARD_TYPE.VILLAIN && !card.isBlanked) acc.containsVillain = true
		else if ((card.type === CARD_TYPE.HERO || card.type === CARD_TYPE.ALLY) && !card.isBlanked) acc.containsHeroOrAlly = true
		return acc
	}, { containsVillain: false, containsHeroOrAlly: false })
	return containsVillain && containsHeroOrAlly
}
