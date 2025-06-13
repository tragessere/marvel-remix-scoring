import { cardList } from '../constants/cardList.ts'
import { Card } from '../types/card.ts'
import { scoreHand } from './score.ts'

interface HandTest {
	id: number
	hand: Card[]
	score: number
}

describe('scoreHand', () => {
	it('returns invalid score without 7 cards', () => {
		const hand: Card[] = [cardList[1]]
		const result = scoreHand(hand)
		expect(result.isValid).toBe(false)
	})
	it('returns undefined without villain', () => {
		const hand: Card[] = [cardList[1], cardList[2], cardList[3], cardList[4], cardList[5], cardList[6], cardList[7]]
		const result = scoreHand(hand)
		expect(result.isValid).toBe(false)
	})
	it('returns undefined without hero or ally', () => {
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
		expect(result.isValid).toBe(false)
		expect(result.finalHand.length).toBe(7)
	})
	it('returns undefined score and a card list when hand is invalid from blanked cards', () => {
		const hand: Card[] = [
			// X-Jet
			cardList[15],
			// Vision
			cardList[33],
			// Find Higher Ground
			cardList[55],
			// Mystique (becomes blanked)
			cardList[66],
			// Avoid Crossfire
			cardList[60],
			// Hidden Lair
			cardList[52],
			// Vibranium Shield
			cardList[16]
		]
		const result = scoreHand(hand)
		expect(result.isValid).toBe(false)
		expect(result.finalHand.length).toBe(7)
	})
	it('subtracts points for Loki draw', () => {
		const hand: Card[] = [
			// Loki
			cardList[73],
			// Thor
			cardList[30],
			// Jane Foster
			cardList[4],
			// Valkyrie
			cardList[41],
			// Mjolnir
			cardList[17],
			// Bifrost
			cardList[42],
			// Halls of Asgard
			cardList[51]
		]
		const result = scoreHand(hand, 8)
		expect(result.score).toBe(105)

		const result2 = scoreHand(hand, 12)
		expect(result2.score).toBe(101)
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
			},
			{
				id: 4,
				hand: [
					// Fearless
					cardList[9],
					// Secret ID
					cardList[10],
					// Bruce Banner
					cardList[29],
					// She-Hulk
					cardList[23],
					// Falling Debris
					cardList[45],
					// Hulk Operations
					cardList[7],
					// Abomination
					cardList[68]
				],
				score: 73
			},
			{
				id: 5,
				hand: [
					// Moira Mactaggert
					cardList[5],
					// Cyclops
					cardList[20],
					// Jean Grey
					cardList[32],
					// Storm
					cardList[40],
					// High Speed Chase
					cardList[43],
					// Avoid Crossfire
					cardList[60],
					// Mystique
					cardList[66]
				],
				score: 109
			},
			{
				id: 6,
				hand: [
					// Black Cat
					cardList[63],
					// Mystique
					cardList[66],
					// Arc Reactor
					cardList[14],
					// X-Jet
					cardList[15],
					// Secret ID
					cardList[10],
					// Assembled
					cardList[8],
					// Heimdall
					cardList[2]
				],
				score: 13
			},
			{
				id: 7,
				hand: [
					// Magneto
					cardList[74],
					// Hack In
					cardList[61],
					// Discover Weakness
					cardList[56],
					// Dora Milaja
					cardList[6],
					// Hulk Operations
					cardList[7],
					// Angel
					cardList[34],
					// Beast
					cardList[35]
				],
				score: 61
			},
			{
				id: 8,
				hand: [
					// X-Jet
					cardList[15],
					// Vision
					cardList[33],
					// Find Higher Ground
					cardList[55],
					// Angel
					cardList[34],
					// Hawkeye
					cardList[39],
					// Jean Grey
					cardList[32],
					// Kang
					cardList[62]
				],
				score: 94
			},
			{
				id: 9,
				hand: [
					// Avoid Crossfire
					cardList[60],
					// Shuri
					cardList[28],
					// Jean Grey
					cardList[32],
					// X-Jet
					cardList[15],
					// Spider-Man
					cardList[22],
					// Angel
					cardList[34],
					// Selene
					cardList[76]
				],
				score: 89
			},
			{
				id: 10,
				hand: [
					// Avoid Crossfire
					cardList[60],
					// Shuri
					cardList[28],
					// Jean Grey
					cardList[32],
					// Sauron
					cardList[64],
					// Angel
					cardList[34],
					// Find Higher Ground
					cardList[55],
					// Cerebro
					cardList[18]
				],
				score: 77
			},
			{
				id: 11,
				hand: [
					// Squirrel Girl
					cardList[80],
					// Hulk Operations
					cardList[7],
					// Angel
					cardList[34],
					// Kang
					cardList[62],
					// Selene
					cardList[76],
					// Sauron
					cardList[64],
					// Hawkeye
					cardList[39]
				],
				score: 80
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
	// 		// Fearless
	// 		cardList[9],
	// 		// Secret ID
	// 		cardList[10],
	// 		// Bruce Banner
	// 		cardList[29],
	// 		// She-Hulk
	// 		cardList[23],
	// 		// Falling Debris
	// 		cardList[45],
	// 		// Hulk Operations
	// 		cardList[7],
	// 		// Abomination
	// 		cardList[68]
	// 	])
	// 	expect(result.score).toBe(99)
	// })
})
