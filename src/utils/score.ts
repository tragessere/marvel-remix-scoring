import cloneDeep from 'lodash-es/cloneDeep'
import isEqual from 'lodash-es/isEqual'
import sumBy from 'lodash-es/sumBy'
import { cardList } from '../constants/cardList.ts'
import { Card, CARD_TYPE, DECK, ModifiedCard } from '../types/card.ts'
import { findCard, getBaseHandSize, getMaxHandSize, isMindStoneTarget, sortEffectCardsFirst } from './card.ts'
import { ManualInput } from './manualInput.ts'
import { generatePermutations } from './randomization.ts'

const MIND_STONE_ID = 104

export interface ScoreResult {
	score: number | undefined
	finalHand: ModifiedCard[]
	isValid: boolean
	maxHandSize: number
}

/**
 * Calculate the score of the hand of cards. Attempts all combinations of card effects to find the max score and the
 * optimal hand that gives the score.
 *
 * @param hand Array of cards in the player's hand
 * @param getManualInputs Board values entered by the user for cards that can't be scored from the hand alone
 * @param baseHandSize Hand size for the decks in play, before Cosmic cards raise the limit
 */
export const scoreHand = (
	hand: Card[],
	getManualInputs: (cardId: number) => ManualInput | undefined,
	baseHandSize: number = getBaseHandSize([DECK.REMIX])
): ScoreResult => {
	const maxHandSize = getMaxHandSize(hand, baseHandSize)
	const isFullHand = hand.length === maxHandSize

	const initialHand: ModifiedCard[] = hand.map(card => {
		const manualInput = getManualInputs(card.id)
		return {
			...card,
			isBlanked: false,
			isBlankedByOtherCard: false,
			isTextBlanked: false,
			modifiedPower: card.power,
			modifiedTags: card.tags.slice(),
			manualInputValue: manualInput?.value,
			manualInputSecondaryValue: manualInput?.secondaryValue
		}
	})

	const borrowedCard = createBorrowedCard(initialHand)
	if (borrowedCard) {
		initialHand.push(borrowedCard)
	}

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
			const { score, hand: resultHand, isValid } = applyEffectsRecursive(modifiedHand, 0)
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
		isValid: isFullHand && optimalHandIsValid,
		maxHandSize
	}
}

/**
 * Add an extra card to the hand, independently handling its transform state.
 */
const createBorrowedCard = (hand: ModifiedCard[]): ModifiedCard | undefined => {
	const mindStone = hand.find(card => card.id === MIND_STONE_ID)
	const borrowedId = mindStone?.manualInputValue
	if (borrowedId === undefined) return undefined

	const card = cardList[borrowedId] as Card | undefined
	if (!card || !isMindStoneTarget(card) || hand.some(c => c.id === borrowedId)) return undefined

	const isTransformed = !!card.transformedTags && mindStone?.manualInputSecondaryValue === 1
	const power = isTransformed ? (card.transformedPower ?? card.power) : card.power
	const tags = isTransformed && card.transformedTags ? card.transformedTags : card.tags
	return {
		...card,
		power,
		transform: undefined,
		isBlanked: false,
		isBlankedByOtherCard: false,
		isTextBlanked: false,
		modifiedPower: power,
		modifiedTags: tags.slice(),
		isTransformed
	}
}

interface Result {
	score: number | undefined
	hand: ModifiedCard[]
	isValid: boolean
}

const applyEffectsRecursive = (hand: ModifiedCard[], index: number): Result => {
	if (index === hand.length) {
		const unblankedHand = hand.filter(card => !card.isBlanked)
		for (const card of hand) {
			if (card.isBlanked) {
				card.modifiedPower = 0
				card.modifiedTags = []
			} else if (!card.isTextBlanked) {
				card.modifiedPower = card.score(unblankedHand)
			}
		}
		return {
			score: sumBy(hand, card => card.modifiedPower),
			hand,
			isValid: containsRequiredCards(hand)
		}
	}

	if (index === 0) {
		applyTransformsUntilStable(hand)
	}

	const currentCard = hand[index]
	if (!currentCard.isBlanked && !currentCard.isTextBlanked && currentCard.modificationOptions && currentCard.effect) {
		const optionCount = currentCard.modificationOptions(hand.filter(card => !card.isBlanked))
		if (!optionCount) {
			return applyEffectsRecursive(hand, index + 1)
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
			applyTransformsUntilStable(modifiedHand)
			const { score, hand: resultHand, isValid } = applyEffectsRecursive(modifiedHand, index + 1)
			if (optimalScore === undefined || (typeof score === 'number' && score > optimalScore)) {
				optimalScore = score
				optimalHand = resultHand
				isOptimalScoreValid = isValid
			}
		}
		return { score: optimalScore, hand: optimalHand, isValid: isOptimalScoreValid }
	} else {
		return applyEffectsRecursive(hand, index + 1)
	}
}

/**
 * Apply transforms repeatedly until the set of blanked cards stops changing, since one card's transform can blank or
 * unblank a card that another transform depends on.
 */
const applyTransformsUntilStable = (hand: ModifiedCard[]) => {
	let blankedCards: boolean[]
	let updatedBlankedCards = hand.map(card => card.isBlanked)
	do {
		blankedCards = updatedBlankedCards
		syncMindStoneCard(hand)
		applyTransforms(
			hand,
			hand.filter(card => !card.isBlanked)
		)
		updatedBlankedCards = hand.map(card => card.isBlanked)
	} while (!isEqual(blankedCards, updatedBlankedCards))
}

const applyTransforms = (hand: ModifiedCard[], unblankedHand: ModifiedCard[]) => {
	const squirrelGirlActive = unblankedHand.some(card => card.id === 80)
	for (const card of hand) {
		if (card.isBlankedByOtherCard || card.isTextBlanked || (squirrelGirlActive && card.type === CARD_TYPE.VILLAIN))
			continue
		card.transform?.(unblankedHand, card)
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

/** A borrowed card only counts while the Mind Stone that borrowed it is active */
const syncMindStoneCard = (hand: ModifiedCard[]) => {
	const mindStone = hand.find(card => card.id === MIND_STONE_ID)
	if (!mindStone) return

	const borrowedId = mindStone.manualInputValue
	const borrowedCard = hand.find(card => card.id === borrowedId)
	if (!borrowedCard) return

	borrowedCard.isBlanked = borrowedCard.isBlankedByOtherCard || mindStone.isBlanked || mindStone.isTextBlanked
}
