import { cardList } from '../constants/cardList.ts'
import { Card } from '../types/card.ts'
import { scoreHand } from './score.ts'

describe('scoreHand', () => {
	it('returns a test score', () => {
		const hand: Card[] = [
			cardList[1],
			cardList[2],
			// worthy
			cardList[11]
		]
		const result = scoreHand(hand)
		expect(result.score).toBe(8)
	})
	it('returns a test score2', () => {
		const hand: Card[] = [
			// Runaway Train
			cardList[46],
			// Avoid Crossfire
			cardList[60],
			// Hulk Operations
			cardList[7],
			// Bruce Banner
			cardList[29],
			// Shuri
			cardList[28],
			// Tony Stark
			cardList[31],
			// Sauron
			cardList[64]
		]
		const result = scoreHand(hand)
		expect(result.score).toBe(103)
	})
})
