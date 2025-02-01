import { cardList } from '../constants/cardList.ts'
import { Card } from '../types/card.ts'
import { scoreHand } from './score.ts'

interface HandTest {
	id: number
	hand: Card[]
	score: number
}

describe('scoreHand', () => {
	it('returns 0 without 7 cards', () => {
		const hand: Card[] = [
			cardList[1],
		]
		const result = scoreHand(hand)
		expect(result.score).toBe(0)
	})
	it('returns 0 without villain', () => {
		const hand: Card[] = [
			cardList[1],
			cardList[2],
			cardList[3],
			cardList[4],
			cardList[5],
			cardList[6],
			cardList[7]
		]
		const result = scoreHand(hand)
		expect(result.score).toBe(0)
	})
	it('returns 0 without hero or ally', () => {
		const hand: Card[] = [
			cardList[8],
			cardList[9],
			cardList[10],
			cardList[11],
			cardList[12],
			cardList[13],
			// villain
			cardList[62]
		]
		const result = scoreHand(hand)
		expect(result.score).toBe(0)
	})
	describe('returns the correct scores', () => {
		//#region example hands
		const exampleHands: HandTest[] = [
			{
				id: 1,
				hand: [
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
				],
				score: 103
			},
			{
				id: 2,
				hand: [
					// Killmonger
					cardList[65],
					// Spear of Bashenga
					cardList[13],
					// Black Panther
					cardList[24],
					// Birnin Zana
					cardList[49],
					// Dora Milaje
					cardList[6],
					// Throw Car
					cardList[59],
					// Shuri
					cardList[28]
				],
				score: 157
			},
			{
				id: 3,
				hand: [
					// Squirrel Girl
					cardList[80],
					// Kang
					cardList[62],
					// Ultron
					cardList[69],
					// Berserk
					cardList[12],
					// Fearless
					cardList[9],
					// Selene
					cardList[76],
					// Remote Fortress
					cardList[53]
				],
				score: 99
			}
		]
		//#endregion example hands

		for (const { id, hand, score } of exampleHands) {
			it(`scores hand ${id}`, () => {
				const result = scoreHand(hand)
				expect(result.score).toBe(score)
			})
		}
	})

	// it('runs a test hand', () => {
	// 	const result = scoreHand([
	// 		// Squirrel Girl
	// 		cardList[80],
	// 		// Kang
	// 		cardList[62],
	// 		// Ultron
	// 		cardList[69],
	// 		// Berserk
	// 		cardList[12],
	// 		// Fearless
	// 		cardList[9],
	// 		// Selene
	// 		cardList[76],
	// 		// Remote Fortress
	// 		cardList[53]
	// 	])
	// 	expect(result.score).toBe(99)
	// })
})
