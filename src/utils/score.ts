import cloneDeep from 'lodash/cloneDeep'
import sumBy from 'lodash/sumBy'
import { Card, ModifiedCard } from '../types/card.ts'
import { sortEffectCardsFirst } from './card.ts'
import { generatePermutations } from './randomization.ts'

export interface ScoreResult {
	score: number
	message: string
	finalHand: ModifiedCard[]
}

const toModifiedCard = (card: Card): ModifiedCard => {
	return {
		...card,
		isBlanked: false,
		modifiedName: card.name,
		modifiedPower: card.power,
		modifiedTags: card.tags
	}
}

/**
 * Calculate the score of the hand of cards. Attempts all combinations of card effects to find the max score and the
 * optimal hand that gives the score.
 *
 * @param hand Array of cards in the player's hand
 */
export const scoreHand = (hand: Card[]): ScoreResult => {
	const initialHand = hand.map(card => {
		return {
			...card,
			isBlanked: false,
			modifiedName: card.name,
			modifiedPower: card.power,
			modifiedTags: card.tags.slice()
		}
	})

	// if (!(hand.some(card => card.name === 'Loki') && hand.length === 8 || hand.length === 7)) {
	// 	return {
	// 		score: 0,
	// 		message: 'Invalid hand',
	// 		finalHand: initialHand
	// 	}
	// }

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
		const { score, hand: resultHand } = applyEffectsRecursive(modifiedHand, 0)
		if (!!score && score > maxScore) {
			maxScore = score
			optimalHand = resultHand
		}
	}

	return {
		score: maxScore,
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
		const filteredHand = hand.filter(card => !card.isBlanked)
		for (const card of hand) {
			if (card.isBlanked) {
				card.modifiedPower = 0
				card.modifiedTags = []
			} else {
				card.modifiedPower = card.score(filteredHand)
			}
		}
		return { score: sumBy(hand, card => card.modifiedPower), hand }
	}
	const currentCard = hand[index]
	if (!currentCard.isBlanked && currentCard.modificationOptions && currentCard.effect) {
		const optionCount = currentCard.modificationOptions(hand)
		if (!optionCount) {
			return applyEffectsRecursive(hand, index + 1)
		}
		let optimalHand: ModifiedCard[] = []
		let optimalScore = 0
		for (let i = 0; i < optionCount; i++) {
			const modifiedHand = cloneDeep(hand)
			currentCard.effect(modifiedHand, i)
			modifiedHand.filter(card => !card.isBlanked)
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
