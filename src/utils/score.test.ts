import { cardList } from '../constants/cardList.ts'
import { Card } from '../types/card.ts'
import { scoreHand } from './score.ts'

interface HandTest {
	id: number
	hand: Card[]
	score: number
}

const emptyManualInput = () => undefined
const createManualInputGetter = (manualEntries: Record<number, number>) => (cardId: number) => manualEntries[cardId]

describe('scoreHand', () => {
	it('returns invalid score without 7 cards', () => {
		const hand: Card[] = [cardList[1]]
		const result = scoreHand(hand, emptyManualInput)
		expect(result.isValid).toBe(false)
	})
	it('returns invalid score without villain', () => {
		const hand: Card[] = [cardList[1], cardList[2], cardList[3], cardList[4], cardList[5], cardList[6], cardList[7]]
		const result = scoreHand(hand, emptyManualInput)
		expect(result.isValid).toBe(false)
	})
	it('returns invalid score without hero or ally', () => {
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
		const result = scoreHand(hand, emptyManualInput)
		expect(result.isValid).toBe(false)
		expect(result.finalHand.length).toBe(7)
	})
	it('returns invalid score score and a card list when hand is invalid from blanked cards', () => {
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
		const result = scoreHand(hand, emptyManualInput)
		expect(result.isValid).toBe(false)
		expect(result.finalHand.length).toBe(7)
	})
	it('counts as valid with a villain transformed to a hero', () => {
		const hand: Card[] = [
			// Magus (transforms into hero)
			cardList[148],
			// Doctor Doom
			cardList[151],
			// Exploding Ship
			cardList[126],
			// Asteroid Field
			cardList[127],
			// Baxter Building
			cardList[129],
			// Knowhere
			cardList[130],
			// Citadel at the End of Time
			cardList[134]
		]
		const result = scoreHand(hand, emptyManualInput)
		expect(result.isValid).toBe(true)
		expect(result.score).toBe(16)
	})
	it('counts as invalid with no villains after a transformation', () => {
		const hand: Card[] = [
			// Magus (transforms into hero, leaving no villains)
			cardList[148],
			// Carol Danvers
			cardList[107],
			// Exploding Ship
			cardList[126],
			// Asteroid Field
			cardList[127],
			// Baxter Building
			cardList[129],
			// Knowhere
			cardList[130],
			// Citadel at the End of Time
			cardList[134]
		]
		const result = scoreHand(hand, emptyManualInput)
		expect(result.isValid).toBe(false)
		expect(result.score).toBe(42)
	})
	describe('handles manual input', () => {
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
			const result = scoreHand(hand, emptyManualInput)
			expect(result.score).toBe(113)

			// Forge: power 4
			let getter = createManualInputGetter({ 73: 1 })
			const result2 = scoreHand(hand, getter)
			expect(result2.score).toBe(109)

			// Lockheed: power 5
			getter = createManualInputGetter({ 73: 3 })
			const result3 = scoreHand(hand, getter)
			expect(result3.score).toBe(108)
		})
		it('Adds points for Moondragon entered tag count', () => {
			const hand: Card[] = [
				// Moondragon
				cardList[123],
				// Cosmo
				cardList[85],
				// Rediscovered Artifact
				cardList[92],
				// The Milano
				cardList[97],
				// Knowhere
				cardList[130],
				// Nebula
				cardList[150],
				// Thanos
				cardList[152]
			]
			const result = scoreHand(hand, emptyManualInput)
			expect(result.score).toBe(83)

			let getter = createManualInputGetter({ 123: 0 })
			const result2 = scoreHand(hand, getter)
			expect(result2.score).toBe(83)

			getter = createManualInputGetter({ 123: 1 })
			const result3 = scoreHand(hand, getter)
			expect(result3.score).toBe(86)
		})
		it('Adds points for Sakaar - Planet Hulk entered HERO count', () => {
			const hand: Card[] = [
				// Sakaar - Planet Hulk
				cardList[128],
				// Spectrum
				cardList[121],
				// Gamora
				cardList[124],
				// Ms. Marvel
				cardList[111],
				// Asteroid Field
				cardList[127],
				// Knowhere
				cardList[130],
				// Supreme Intelligence
				cardList[155]
			]
			const result = scoreHand(hand, emptyManualInput)
			expect(result.score).toBe(41)

			let getter = createManualInputGetter({ 128: 0 })
			const result2 = scoreHand(hand, getter)
			expect(result2.score).toBe(41)

			getter = createManualInputGetter({ 128: 1 })
			const result3 = scoreHand(hand, getter)
			expect(result3.score).toBe(46)
		})
		it('Adds points for High Evolutionary if criteria is indicated to have passed', () => {
			const hand: Card[] = [
				// The High Evolutionary
				cardList[164],
				// Mantis
				cardList[81],
				// Nick Fury, Jr.
				cardList[82],
				// Eddie Brock
				cardList[83],
				// Cosmo
				cardList[85],
				// Timekeepers
				cardList[86],
				// Emperor N'Jadaka
				cardList[156]
			]
			const result = scoreHand(hand, emptyManualInput)
			expect(result.score).toBe(39)

			let getter = createManualInputGetter({ 164: 0 })
			const result2 = scoreHand(hand, getter)
			expect(result2.score).toBe(39)

			getter = createManualInputGetter({ 164: 1 })
			const result3 = scoreHand(hand, getter)
			expect(result3.score).toBe(59)
		})
		it('Adds points for Galactus if criteria is indicated to have passed', () => {
			// Hand has 8 cards, Galactus is an extra
			const hand: Card[] = [
				// Galactus
				cardList[147],
				// Nick Fury, Jr.
				cardList[82],
				// Cosmo
				cardList[85],
				// Cosmically Attuned
				cardList[91],
				// Quantum Bands
				cardList[99],
				// Asteroid Field
				cardList[127],
				// Knowhere
				cardList[130],
				// The Peak (VII)
				cardList[133]
			]
			const result = scoreHand(hand, emptyManualInput)
			expect(result.score).toBe(52)

			let getter = createManualInputGetter({ 147: 0 })
			const result2 = scoreHand(hand, getter)
			expect(result2.score).toBe(52)

			getter = createManualInputGetter({ 147: 1 })
			const result3 = scoreHand(hand, getter)
			expect(result3.score).toBe(67)
		})
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
			},
			{
				id: 12,
				hand: [
					// Remote Fortress
					cardList[53],
					// Bifrost
					cardList[42],
					// Forge
					cardList[1],
					// Jane Foster
					cardList[4],
					// Kingpin
					cardList[78],
					// Build Gadgets
					cardList[58],
					// Toad
					cardList[79]
				],
				score: 9
			},
			{
				id: 13,
				hand: [
					// Heimdall
					cardList[2],
					// Colossus
					cardList[37],
					// Captain America
					cardList[19],
					// Halls of Asgard
					cardList[51],
					// Arc Reactor
					cardList[14],
					// Vibranium Shield
					cardList[16],
					// Mystique
					cardList[66]
				],
				score: 32
			},
			{
				id: 14,
				hand: [
					// Squirrel Girl
					cardList[80],
					// Baron Zemo
					cardList[72],
					// Magneto
					cardList[74],
					// The Leader
					cardList[71],
					// Mystique
					cardList[66],
					// Kingpin
					cardList[78],
					// Kang
					cardList[62]
				],
				score: 82
			},
			{
				id: 15,
				hand: [
					// Juggernaut
					cardList[77],
					// Kingpin
					cardList[78],
					// High Speed Chase
					cardList[43],
					// Forge
					cardList[1],
					// Heimdall
					cardList[2],
					// Lockheed
					cardList[3],
					// Jane Foster
					cardList[4]
				],
				score: 34
			},
			{
				id: 16,
				hand: [
					// Hidden Lair
					cardList[52],
					// Kingpin
					cardList[78],
					// Toad
					cardList[79],
					// Remote Fortress
					cardList[53],
					// High Speed Chase
					cardList[43],
					// Forge
					cardList[1],
					// Heimdall
					cardList[2]
				],
				score: 52
			},
			{
				id: 17,
				hand: [
					// Squirrel Girl
					cardList[80],
					// Selene
					cardList[76],
					// Kingpin
					cardList[78],
					// Kang
					cardList[62],
					// Hulk Operations
					cardList[7],
					// Thor Odinson
					cardList[30],
					// Jane Foster
					cardList[4]
				],
				score: 83
			}
		]
		//#endregion example hands

		for (const { id, hand, score } of exampleHands) {
			it(`scores hand ${id}`, () => {
				const result = scoreHand(hand, emptyManualInput)
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
