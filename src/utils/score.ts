import cloneDeep from 'lodash/cloneDeep'
import sumBy from 'lodash/sumBy'
import { Card, CARD_TYPE, ModifiedCard } from '../types/card.ts'
import { findCard, sortEffectCardsFirst } from './card.ts'
import { generatePermutations } from './randomization.ts'

export interface ScoreResult {
	score: number | undefined
	finalHand: ModifiedCard[]
	isValid: boolean
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
		return <ModifiedCard>{
			...card,
			isBlanked: false,
			isTextBlanked: false,
			modifiedPower: card.power,
			modifiedTags: card.tags.slice()
		}
	})

	initialHand.sort(sortEffectCardsFirst)
	const modifyCardCount = initialHand.filter(card => !!card.effect).length
	const modifyCards = initialHand.slice(0, modifyCardCount)
	const countCards = initialHand.slice(modifyCardCount)
	const orderCombinations = generatePermutations(modifyCardCount)

	let maxScore = undefined
	let optimalHand: ModifiedCard[] = []
	let optimalHandIsValid = false
	for (const order of orderCombinations) {
		const orderedHand = order.map(index => modifyCards[index]).concat(countCards)
		const modifiedHand = cloneDeep(orderedHand)
		try {
			const { score, hand: resultHand, isValid } = applyEffectsRecursive(modifiedHand, 0, lokiPenalty)
			// Save cards as optimal hand for the first result so we can guarantee having updated cards.
			// Otherwise only update the hand when we successfully get a score and it's higher than the previous one
			if (optimalHand.length === 0 || (score !== undefined && (maxScore === undefined || score > maxScore))) {
				maxScore = score
				optimalHand = resultHand
				optimalHandIsValid = isValid
			}
		} catch {
			/* invalid order of operation, skip hand */
		}
	}

	return {
		score: maxScore,
		finalHand: optimalHand,
		isValid: optimalHandIsValid
	}
}

interface Result {
	score: number | undefined
	hand: ModifiedCard[]
	isValid: boolean
}

const applyEffectsRecursive = (hand: ModifiedCard[], index: number, lokiPenalty: number | undefined): Result => {
	if (index === hand.length) {
		const unblankedHand = hand.filter(card => !card.isBlanked)
		for (const card of hand) {
			if (card.isBlanked) {
				card.modifiedPower = 0
				card.modifiedTags = []
			} else if (!card.isTextBlanked) {
				card.modifiedPower = card.score(unblankedHand)
				if (card.id === 73) {
					card.modifiedPower -= lokiPenalty || 0
				}
			}
		}
		return {
			score: sumBy(hand, card => card.modifiedPower),
			hand,
			isValid: containsRequiredCards(hand)
		}
	}

	if (index === 0) {
		hand.forEach(card => card.transform?.(hand, card))
	}

	const currentCard = hand[index]
	if (!currentCard.isBlanked && !currentCard.isTextBlanked && currentCard.modificationOptions && currentCard.effect) {
		const optionCount = currentCard.modificationOptions(hand.filter(card => !card.isBlanked))
		if (!optionCount) {
			return applyEffectsRecursive(hand, index + 1, lokiPenalty)
		}
		let optimalHand: ModifiedCard[] = []
		let optimalScore = undefined
		let isOptimalScoreValid = false
		for (let i = 0; i < optionCount; i++) {
			const modifiedHand = cloneDeep(hand)
			const clonedCurrentCard = findCard(modifiedHand, currentCard.id)
			const unblankedHand = modifiedHand.filter(card => !card.isBlanked)
			// Use null-safe access to make Typescript happy. `effect` function will always exist here because it
			// was checked on the card before cloning.
			clonedCurrentCard.effect?.(unblankedHand, i)
			modifiedHand.forEach(card => card.transform?.(unblankedHand, card))
			const { score, hand: resultHand, isValid } = applyEffectsRecursive(modifiedHand, index + 1, lokiPenalty)
			if (optimalScore === undefined || (typeof score === 'number' && score > optimalScore)) {
				optimalScore = score
				optimalHand = resultHand
				isOptimalScoreValid = isValid
			}
		}
		return { score: optimalScore, hand: optimalHand, isValid: isOptimalScoreValid }
	} else {
		return applyEffectsRecursive(hand, index + 1, lokiPenalty)
	}
}

const containsRequiredCards = (hand: ModifiedCard[]): boolean => {
	const { containsVillain, containsHeroOrAlly } = hand.reduce(
		(acc, card) => {
			if (card.type === CARD_TYPE.VILLAIN && !card.isBlanked) acc.containsVillain = true
			else if ((card.type === CARD_TYPE.HERO || card.type === CARD_TYPE.ALLY) && !card.isBlanked)
				acc.containsHeroOrAlly = true
			return acc
		},
		{ containsVillain: false, containsHeroOrAlly: false }
	)
	return containsVillain && containsHeroOrAlly
}
