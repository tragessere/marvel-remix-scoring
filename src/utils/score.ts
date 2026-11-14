import isEqual from 'lodash-es/isEqual'
import sumBy from 'lodash-es/sumBy'
import { cardList } from '../constants/cardList.ts'
import { Card, CARD_TYPE, DECK, ModifiedCard } from '../types/card.ts'
import {
	countGalactusTags,
	countIntelAndGuardianTags,
	findCard,
	getBaseHandSize,
	getMaxHandSize,
	isMindStoneTarget,
	sortEffectCardsFirst
} from './card.ts'
import { ManualInput } from './manualInput.ts'
import { generatePermutations } from './randomization.ts'

const MIND_STONE_ID = 104
const GALACTUS_ID = 147

/** A number of different tags Galactus can count, and the best score that keeps at least that many */
export interface GalactusOption {
	tagCount: number
	score: number
}

export interface ScoreResult {
	score: number | undefined
	finalHand: ModifiedCard[]
	isValid: boolean
	maxHandSize: number
	/** Trade-offs between keeping more tags for Galactus and scoring more points, from most tags to highest score */
	galactusOptions: GalactusOption[]
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

	const results: ResultsByTagCount = new Map()
	for (const order of orderCombinations) {
		const orderedHand = order.map(index => modifyCards[index]).concat(countCards)
		const modifiedHand = cloneHand(orderedHand)
		try {
			mergeResults(results, applyEffectsRecursive(modifiedHand, 0))
		} catch {
			/* invalid order of operation, skip hand */
		}
	}

	const galactus = initialHand.find(card => card.id === GALACTUS_ID)
	const galactusOptions = getGalactusOptions(results)
	const optimalResult = selectResult(results, galactusOptions, galactus?.manualInputSecondaryValue)

	return {
		score: optimalResult?.score,
		finalHand: optimalResult?.hand ?? [],
		isValid: isFullHand && !!optimalResult?.isValid,
		maxHandSize,
		galactusOptions: galactus ? galactusOptions : []
	}
}

/**
 * Options worth choosing between for Galactus. Keeping fewer tags is only an option if it scores more than keeping
 * any higher number of tags.
 */
const getGalactusOptions = (results: ResultsByTagCount): GalactusOption[] => {
	const options: GalactusOption[] = []
	const resultsByMostTags = Array.from(results.entries()).sort(([a], [b]) => b - a)
	for (const [tagCount, { score }] of resultsByMostTags) {
		if (score === undefined) continue
		if (options.length === 0 || score > options[options.length - 1].score) {
			options.push({ tagCount, score })
		}
	}
	return options
}

/**
 * Pick the result to show. Uses the highest score unless the player chose a number of tags to keep for Galactus.
 *
 * @param results Mapping from each tag count to the best scoring hand for that tag count.
 * @param options collection of tag counts and their respective scores.
 * @param targetTagCount Fewest different tags to keep. Falls back to the most tags available if it can't be reached.
 */
const selectResult = (results: ResultsByTagCount, options: GalactusOption[], targetTagCount: number | undefined) => {
	const option =
		targetTagCount === undefined
			? options.at(-1)
			: (options.findLast(option => option.tagCount >= targetTagCount) ?? options[0])
	// With no scored option, fall back to any result so we can guarantee having updated cards
	return option ? results.get(option.tagCount) : results.values().next().value
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

/**
 * Whether a result beats the current best with the same Galactus tag count. Tiebreakers on various tag counts.
 */
const isPreferredResult = (
	score: number | undefined,
	hand: ModifiedCard[],
	bestScore: number | undefined,
	bestHand: ModifiedCard[]
) => {
	// invalid hand
	if (score === undefined) return false
	// prefer higher scores
	if (bestScore === undefined || score > bestScore) return true
	// false for lower scores, otherwise continue to tiebreakers
	if (score !== bestScore) return false

	// Prefer fewer INTEL and GUARDIAN tags to avoid helping other players
	return countIntelAndGuardianTags(hand) < countIntelAndGuardianTags(bestHand)
}

interface Result {
	score: number | undefined
	hand: ModifiedCard[]
	isValid: boolean
}

/**
 * Best result for each number of different tags counted by Galactus. Without Galactus in the hand, every result
 * shares the key 0. Ties between different tag counts are settled by `getGalactusOptions`, which prefers more tags.
 */
type ResultsByTagCount = Map<number, Result>

const getGalactusKey = (hand: ModifiedCard[]) =>
	hand.some(card => card.id === GALACTUS_ID) ? countGalactusTags(hand) : 0

const addResult = (results: ResultsByTagCount, result: Result) => {
	const key = getGalactusKey(result.hand)
	const best = results.get(key)
	// Save the first result so we can guarantee having updated cards. Otherwise only update the hand when we
	// successfully get a score that beats the previous one
	if (!best || isPreferredResult(result.score, result.hand, best.score, best.hand)) {
		results.set(key, result)
	}
}

const mergeResults = (results: ResultsByTagCount, newResults: ResultsByTagCount) => {
	for (const result of newResults.values()) {
		addResult(results, result)
	}
}

const applyEffectsRecursive = (hand: ModifiedCard[], index: number): ResultsByTagCount => {
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
		const result = {
			score: sumBy(hand, card => card.modifiedPower),
			hand,
			isValid: containsRequiredCards(hand)
		}
		return new Map([[getGalactusKey(hand), result]])
	}

	if (index === 0) {
		applyTransformsUntilStable(hand)
	}

	const currentCard = hand[index]
	// Set before cloning so every option's hand sees this card's effect as resolved when transforms run after it
	currentCard.isEffectResolved = true
	if (!currentCard.isBlanked && !currentCard.isTextBlanked && currentCard.modificationOptions && currentCard.effect) {
		const optionCount = currentCard.modificationOptions(hand.filter(card => !card.isBlanked))
		if (!optionCount) {
			return applyEffectsRecursive(hand, index + 1)
		}
		const results: ResultsByTagCount = new Map()
		for (let i = 0; i < optionCount; i++) {
			const modifiedHand = cloneHand(hand)
			const clonedCurrentCard = findCard(modifiedHand, currentCard.id)
			const unblankedHand = modifiedHand.filter(card => !card.isBlanked)
			try {
				// Use null-safe access to make Typescript happy. `effect` function will always exist here because it
				// was checked on the card before cloning.
				clonedCurrentCard.effect?.(unblankedHand, i)
				applyTransformsUntilStable(modifiedHand)
			} catch {
				// This option leaves the hand in an invalid state, skip it without discarding the other options
				continue
			}
			mergeResults(results, applyEffectsRecursive(modifiedHand, index + 1))
		}
		return results
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

/**
 * Clone hand into a new object. Uses a shallow copy of all properties except modifiedTags.
 */
const cloneHand = (hand: ModifiedCard[]): ModifiedCard[] =>
	hand.map(card => ({ ...card, modifiedTags: card.modifiedTags.slice() }))
