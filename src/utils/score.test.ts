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
})
