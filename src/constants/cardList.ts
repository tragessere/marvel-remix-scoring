import type { Dictionary } from 'lodash'
import sumBy from 'lodash/sumBy'
import { Card, CARD_TYPE, ModifiedCard, TAG } from '../types/card.ts'
import { findCard, removeTag } from '../utils/card.ts'
import { generateCombinations } from '../utils/randomization.ts'
import { count } from '../utils/whyIsThisNotInLodash.ts'

export const cardList: Readonly<Dictionary<Card>> = {
	//#region Ally
	1: {
		id: 1,
		name: 'Forge',
		type: CARD_TYPE.ALLY,
		power: 4,
		tags: [TAG.TECH, TAG.MUTANT],
		score(hand) {
			const equipmentCount = count(hand, card => card.type === CARD_TYPE.EQUIPMENT)
			return this.power + equipmentCount * 4
		}
	},
	2: {
		id: 2,
		name: 'Heimdall',
		type: CARD_TYPE.ALLY,
		power: 4,
		tags: [TAG.ASGARD, TAG.INTEL],
		score(hand) {
			const containsBifrost = hand.some(card => card.id === 42)
			return this.power + (containsBifrost ? 6 : 0)
		}
	},
	3: {
		id: 3,
		name: 'Lockheed',
		type: CARD_TYPE.ALLY,
		power: 5,
		tags: [TAG.FLIGHT, TAG.RANGE],
		score(hand) {
			const containsShadowcat = hand.some(card => card.id === 21)
			return this.power + (containsShadowcat ? 7 : 0)
		}
	},
	4: {
		id: 4,
		name: 'Jane Foster',
		type: CARD_TYPE.ALLY,
		power: 5,
		tags: [TAG.TECH, TAG.WORTHY],
		score(hand) {
			const containsThor = hand.some(card => card.id === 30)
			return this.power + (containsThor ? 8 : 0)
		}
	},
	5: {
		id: 5,
		name: 'Moira Mactaggert',
		type: CARD_TYPE.ALLY,
		power: 3,
		tags: [TAG.TECH, TAG.INTEL],
		effect: (hand, index) => {
			let indexCount = index
			const targetCard = hand.find(card => {
				if (card.type === CARD_TYPE.HERO && card.modifiedTags.includes(TAG.MUTANT)) {
					if (indexCount < card.modifiedTags.length) {
						return true
					}
					indexCount -= card.modifiedTags.length
				}
			}) as ModifiedCard
			targetCard.modifiedTags.push(targetCard.modifiedTags[indexCount])
		},
		modificationOptions: (hand: ModifiedCard[]) =>
			sumBy(hand, card =>
				card.type === CARD_TYPE.HERO && card.modifiedTags.includes(TAG.MUTANT) ? card.modifiedTags.length : 0
			),
		score() {
			return this.power
		}
	},
	6: {
		id: 6,
		name: 'Dora Milaje',
		type: CARD_TYPE.ALLY,
		power: 6,
		tags: [TAG.AGILITY, TAG.INTEL, TAG.WAKANDA],
		score() {
			return this.power
		}
	},
	7: {
		id: 7,
		name: 'Hulk Operations',
		type: CARD_TYPE.ALLY,
		power: 4,
		tags: [TAG.GAMMA, TAG.RANGE, TAG.TECH],
		score() {
			return this.power
		}
	},
	//#endregion Ally
	//#region Condition
	8: {
		id: 8,
		name: 'Assembled',
		type: CARD_TYPE.CONDITION,
		power: 0,
		tags: [],
		score(hand) {
			const heroCount = hand.filter(card => card.type === CARD_TYPE.HERO).length
			return heroCount * 4
		}
	},
	9: {
		id: 9,
		name: 'Fearless',
		type: CARD_TYPE.CONDITION,
		power: 16,
		tags: [TAG.AGILITY],
		effect(hand) {
			const heroCount = hand.filter(card => card.type === CARD_TYPE.HERO).length
			if (heroCount > 1) {
				const self = findCard(hand, this.id)
				self.isBlanked = true
			}
		},
		modificationOptions() {
			return 1
		},
		score() {
			return this.power
		}
	},
	10: {
		id: 10,
		name: 'Secret ID',
		type: CARD_TYPE.CONDITION,
		power: 8,
		tags: [TAG.INTEL],
		effect(hand) {
			const hasHero = hand.some(card => card.type === CARD_TYPE.HERO)
			const hasUrbanLocation = hand.some(
				card => card.type === CARD_TYPE.LOCATION && card.modifiedTags.includes(TAG.URBAN)
			)
			if (!hasHero || !hasUrbanLocation) {
				const self = findCard(hand, this.id)
				self.isBlanked = true
			}
		},
		modificationOptions() {
			return 1
		},
		score() {
			return this.power
		}
	},
	11: {
		id: 11,
		name: 'Worthy',
		type: CARD_TYPE.CONDITION,
		power: 11,
		tags: [TAG.WORTHY],
		effect(hand) {
			const hasMatchingVillain = hand.some(card => card.type === CARD_TYPE.VILLAIN && card.modifiedPower > 12)
			if (!hasMatchingVillain) {
				const self = findCard(hand, this.id)
				self.isBlanked = true
			}
		},
		modificationOptions() {
			return 1
		},
		score() {
			return this.power
		}
	},
	12: {
		id: 12,
		name: 'Berserk',
		type: CARD_TYPE.CONDITION,
		power: 18,
		tags: [TAG.GAMMA, TAG.STRENGTH],
		score(hand) {
			let heroOrAllyCount = hand.filter(
				card => card.type === CARD_TYPE.HERO || card.type === CARD_TYPE.ALLY
			).length
			const urbanCount = sumBy(hand, card => count(card.modifiedTags, tag => tag === TAG.URBAN))
			if (heroOrAllyCount > 0) {
				heroOrAllyCount--
			}
			return this.power - heroOrAllyCount * 3 - urbanCount * 3
		}
	},
	//#endregion Condition
	//#region Equipment
	13: {
		id: 13,
		name: 'Spear of Bashenga',
		type: CARD_TYPE.EQUIPMENT,
		power: 0,
		tags: [TAG.WAKANDA],
		score(hand) {
			const bonusCount =
				count(hand, card => card.type === CARD_TYPE.EQUIPMENT) +
				sumBy(hand, card => count(card.modifiedTags, tag => tag === TAG.WAKANDA))
			// Do not count the 'Equipment' type and 'Wakanda' tag of this card
			return (bonusCount - 2) * 7
		}
	},
	14: {
		id: 14,
		name: 'Arc Reactor',
		type: CARD_TYPE.EQUIPMENT,
		power: 0,
		tags: [],
		score(hand) {
			const techCount = sumBy(hand, card => count(card.modifiedTags, tag => tag === TAG.TECH))
			return techCount * 9
		}
	},
	15: {
		id: 15,
		name: 'X-Jet',
		type: CARD_TYPE.EQUIPMENT,
		power: 7,
		tags: [],
		effect(hand, index) {
			const heroesAndAllies = hand.filter(
				card => !card.isBlanked && (card.type === CARD_TYPE.HERO || card.type === CARD_TYPE.ALLY)
			)
			for (let i = 0; i < heroesAndAllies.length; i++) {
				const heroOrAlly = heroesAndAllies[i]
				if (!heroOrAlly.modifiedTags.some(tag => tag === TAG.FLIGHT)) {
					heroOrAlly.modifiedTags.push(TAG.FLIGHT)
				}
				if (index === i) {
					heroOrAlly.modifiedTags.push(TAG.RANGE)
				}
			}
		},
		modificationOptions(hand) {
			return hand.filter(
				card => !card.isBlanked && (card.type === CARD_TYPE.HERO || card.type === CARD_TYPE.ALLY)
			).length
		},
		score() {
			return this.power
		}
	},
	16: {
		id: 16,
		name: 'Vibranium Shield',
		type: CARD_TYPE.EQUIPMENT,
		power: 9,
		tags: [TAG.RANGE, TAG.STRENGTH],
		effect(hand) {
			const hasValidHero = hand.some(
				c => c.type === CARD_TYPE.HERO && !c.isBlanked && c.modifiedTags.includes(TAG.AGILITY)
			)
			if (!hasValidHero) {
				const self = findCard(hand, this.id)
				self.isBlanked = true
			}
		},
		modificationOptions() {
			return 1
		},
		score() {
			return this.power
		}
	},
	17: {
		id: 17,
		name: 'Mjolnir',
		type: CARD_TYPE.EQUIPMENT,
		power: 10,
		tags: [TAG.ASGARD, TAG.FLIGHT, TAG.RANGE],
		effect(hand) {
			const hasWorthyOrWorthyTag = hand.some(
				c =>
					(!c.isBlanked && c.id === 11) ||
					((c.type === CARD_TYPE.HERO || c.type === CARD_TYPE.ALLY) && c.tags.includes(TAG.WORTHY))
			)
			if (!hasWorthyOrWorthyTag) {
				const self = findCard(hand, this.id)
				self.isBlanked = true
			}
		},
		modificationOptions() {
			return 1
		},
		score() {
			return this.power
		}
	},
	18: {
		id: 18,
		name: 'Cerebro',
		type: CARD_TYPE.EQUIPMENT,
		power: 8,
		tags: [TAG.INTEL],
		// Card effect is used during play, not for scoring
		score() {
			return this.power
		}
	},
	//#endregion Equipment
	//#region Hero
	19: {
		id: 19,
		name: 'Captain America',
		type: CARD_TYPE.HERO,
		power: 4,
		tags: [TAG.AGILITY, TAG.WORTHY],
		score(hand) {
			const heroCount = hand.filter(card => card.type === CARD_TYPE.HERO && card.id !== 19).length
			const hasShield = hand.some(card => card.id === 16)
			return this.power + heroCount * 2 + (hasShield ? 4 : 0)
		}
	},
	20: {
		id: 20,
		name: 'Cyclops',
		type: CARD_TYPE.HERO,
		power: 4,
		tags: [TAG.RANGE, TAG.MUTANT],
		score(hand) {
			const mutantCount = sumBy(hand, card =>
				card.id !== 20 ? count(card.modifiedTags, t => t === TAG.MUTANT) : 0
			)
			return this.power + mutantCount * 3
		}
	},
	21: {
		id: 21,
		name: 'Shadowcat',
		type: CARD_TYPE.HERO,
		power: 4,
		tags: [TAG.MUTANT, TAG.TECH],
		score(hand) {
			const hasLocation = hand.some(card => card.type === CARD_TYPE.LOCATION)
			return this.power + (hasLocation ? 4 : 0)
		}
	},
	22: {
		id: 22,
		name: 'Spider-Man',
		type: CARD_TYPE.HERO,
		power: 5,
		tags: [TAG.AGILITY, TAG.STRENGTH],
		effect(hand) {
			const hasMatchingLocation = hand.some(
				c => c.type === CARD_TYPE.LOCATION && c.modifiedTags.includes(TAG.URBAN)
			)
			if (hasMatchingLocation) {
				const self = findCard(hand, 22)
				self.modifiedTags.push(TAG.FLIGHT)
			}
		},
		modificationOptions() {
			return 1
		},
		score(hand) {
			const hasMatchingLocation = hand.some(
				c => c.type === CARD_TYPE.LOCATION && c.modifiedTags.includes(TAG.URBAN)
			)
			return this.power + (hasMatchingLocation ? 5 : 0)
		}
	},
	23: {
		id: 23,
		name: 'She-Hulk',
		type: CARD_TYPE.HERO,
		power: 4,
		tags: [TAG.GAMMA, TAG.STRENGTH],
		score(hand) {
			const gammaCount = sumBy(hand, card =>
				card.id !== 23 ? count(card.modifiedTags, t => t === TAG.GAMMA) : 0
			)
			return this.power + gammaCount * 5
		}
	},
	24: {
		id: 24,
		name: 'Black Panther',
		type: CARD_TYPE.HERO,
		power: 4,
		tags: [TAG.AGILITY, TAG.WAKANDA],
		score(hand) {
			const wakandaCount = sumBy(hand, card =>
				card.id !== 24 ? count(card.modifiedTags, t => t === TAG.WAKANDA) : 0
			)
			return this.power + wakandaCount * 5
		}
	},
	25: {
		id: 25,
		name: 'Professor X',
		type: CARD_TYPE.HERO,
		power: 3,
		tags: [TAG.INTEL, TAG.MUTANT],
		score(hand) {
			const hasCerebro = hand.some(card => card.id === 18)
			const hasMansion = hand.some(card => card.id === 54)
			return this.power + (hasCerebro ? 6 : 0) + (hasMansion ? 6 : 0)
		}
	},
	26: {
		id: 26,
		name: 'Wolverine',
		type: CARD_TYPE.HERO,
		power: 4,
		tags: [TAG.AGILITY, TAG.MUTANT],
		score(hand) {
			const hasMatchingVillain = hand.some(c => c.type === CARD_TYPE.VILLAIN && c.modifiedTags.includes(TAG.BOSS))
			return this.power + (hasMatchingVillain ? 6 : 0)
		}
	},
	27: {
		id: 27,
		name: 'Rogue',
		type: CARD_TYPE.HERO,
		power: 0,
		tags: [TAG.MUTANT],
		effect(hand, index) {
			let indexCount = index
			const targetCard = hand.find(card => {
				if (!card.isBlanked && card.type === CARD_TYPE.HERO && card.modifiedTags.length > 0) {
					if (indexCount < card.modifiedTags.length) {
						return true
					}
					indexCount -= card.modifiedTags.length
				}
			}) as ModifiedCard
			const self = hand.find(card => card.id === 27) as ModifiedCard
			self.modifiedPower = targetCard.modifiedPower
			self.modifiedTags.push(targetCard.modifiedTags[indexCount])
		},
		modificationOptions(hand) {
			return sumBy(hand, card => (card.type === CARD_TYPE.HERO && !card.isBlanked ? card.modifiedTags.length : 0))
		},
		score(cards) {
			const self = findCard(cards, 27)
			return self.modifiedPower
		}
	},
	28: {
		id: 28,
		name: 'Shuri',
		type: CARD_TYPE.HERO,
		power: 2,
		tags: [TAG.TECH, TAG.WAKANDA],
		effect(hand, index) {
			const tagOptions = [TAG.AGILITY, TAG.RANGE, TAG.STRENGTH]
			const ownTagSelectionIndex = index % 3
			const ownTagChoice = tagOptions[ownTagSelectionIndex]
			const targetCardSelectionIndex = Math.floor(index / 3)
			let indexCount = targetCardSelectionIndex
			const targetCard = hand.find(card => {
				if (card.id !== this.id && (card.type === CARD_TYPE.HERO || card.type === CARD_TYPE.ALLY)) {
					if (indexCount < 3) {
						return true
					}
					indexCount -= card.modifiedTags.length
				}
			}) as ModifiedCard
			const targetCardTagChoice = tagOptions[indexCount]
			const self = findCard(hand, 28)
			self.modifiedTags.push(ownTagChoice)
			targetCard.modifiedTags.push(targetCardTagChoice)
		},
		modificationOptions(hand) {
			const targetCardCount = count(
				hand,
				card => card.id !== this.id && (card.type === CARD_TYPE.HERO || card.type === CARD_TYPE.ALLY)
			)
			// Affects self plus one other card
			return (targetCardCount + 1) * 3
		},
		score() {
			return this.power
		}
	},
	29: {
		id: 29,
		name: 'Bruce Banner',
		type: CARD_TYPE.HERO,
		power: 1,
		tags: [TAG.GAMMA, TAG.TECH],
		transform(hand) {
			const self = findCard(hand, this.id)
			const isTransformed = !!self.isTransformed
			const shouldTransform = hand.some(
				card => card !== self && !card.isBlanked && card.modifiedTags.includes(TAG.GAMMA)
			)

			if (isTransformed === shouldTransform) {
				return
			}

			if (shouldTransform) {
				self.isTransformed = true
				self.modifiedName = 'Hulk'
				self.modifiedPower = 13
				removeTag(self, TAG.TECH)
				self.modifiedTags.push(TAG.STRENGTH, TAG.STRENGTH, TAG.STRENGTH)
			} else {
				self.isTransformed = false
				self.modifiedName = 'Bruce Banner'
				self.modifiedPower = 1
				removeTag(self, TAG.STRENGTH, 3)
				self.modifiedTags.push(TAG.TECH)
			}
		},
		score(hand) {
			return findCard(hand, this.id).modifiedPower
		}
	},
	30: {
		id: 30,
		name: 'Thor Odinson',
		type: CARD_TYPE.HERO,
		power: 4,
		tags: [TAG.ASGARD, TAG.STRENGTH, TAG.WORTHY],
		transform(hand) {
			const self = findCard(hand, 30)
			const isTransformed = !!self.isTransformed
			const hasMjolnir = hand.some(card => card.id === 17 && !card.isBlanked)
			const allyCount = count(hand, card => card.type === CARD_TYPE.ALLY && !card.isBlanked)
			const shouldTransform = hasMjolnir || allyCount > 1

			if (isTransformed === shouldTransform) {
				return
			}

			if (shouldTransform) {
				self.isTransformed = true
				self.modifiedName = 'God Of Thunder'
				self.modifiedPower = 12
				self.modifiedTags.push(TAG.FLIGHT, TAG.RANGE)
			} else {
				self.isTransformed = false
				self.modifiedName = 'Thor Odinson'
				self.modifiedPower = 4
				removeTag(self, TAG.FLIGHT)
				removeTag(self, TAG.RANGE)
			}
		},
		score(hand) {
			return findCard(hand, this.id).modifiedPower
		}
	},
	31: {
		id: 31,
		name: 'Tony Stark',
		type: CARD_TYPE.HERO,
		power: 3,
		tags: [TAG.TECH, TAG.RANGE],
		transform(hand) {
			const self = findCard(hand, this.id)
			const isTransformed = !!self.isTransformed
			const shouldTransform = sumBy(hand, card => count(card.modifiedTags, t => t === TAG.INTEL)) > 1

			if (isTransformed === shouldTransform) {
				return
			}

			if (shouldTransform) {
				self.isTransformed = true
				self.modifiedName = 'Iron Man'
				self.modifiedPower = 8
				self.modifiedTags.push(TAG.FLIGHT, TAG.STRENGTH)
			} else {
				self.isTransformed = false
				self.modifiedName = 'Tony Stark'
				self.modifiedPower = 3
				removeTag(self, TAG.FLIGHT)
				removeTag(self, TAG.STRENGTH)
			}
		},
		score(hand) {
			return findCard(hand, this.id).modifiedPower
		}
	},
	32: {
		id: 32,
		name: 'Jean Grey',
		type: CARD_TYPE.HERO,
		power: 3,
		tags: [TAG.INTEL, TAG.MUTANT, TAG.RANGE],
		transform(hand) {
			const self = findCard(hand, this.id)
			const isTransformed = !!self.isTransformed
			const shouldTransform =
				sumBy(hand, card =>
					!card.isBlanked && card !== self ? count(card.modifiedTags, t => t === TAG.MUTANT) : 0
				) > 1

			if (isTransformed === shouldTransform) {
				return
			}

			if (shouldTransform) {
				self.isTransformed = true
				self.modifiedName = 'Phoenix'
				self.modifiedPower = 9
				self.modifiedTags.push(TAG.FLIGHT)
				self.modifiedTags.push(TAG.RANGE)
			} else {
				self.isTransformed = false
				self.modifiedName = 'Jean Grey'
				self.modifiedPower = 3
				removeTag(self, TAG.FLIGHT)
				removeTag(self, TAG.RANGE)
			}
		},
		score(hand) {
			return findCard(hand, this.id).modifiedPower
		}
	},
	33: {
		id: 33,
		name: 'Vision',
		type: CARD_TYPE.HERO,
		power: 3,
		tags: [TAG.WORTHY],
		effect(hand, index) {
			const self = findCard(hand, this.id)
			const options = [TAG.FLIGHT, TAG.RANGE, TAG.STRENGTH, TAG.TECH]
			let optionIndex = 0
			for (let i = 0; i < options.length - 1; i++) {
				for (let j = 1; j < options.length; j++) {
					if (index === optionIndex) {
						self.modifiedTags.push(options[i])
						self.modifiedTags.push(options[j])
						return
					}
					optionIndex++
				}
			}
		},
		modificationOptions() {
			return 6 // 4 choose 2
		},
		score() {
			return this.power
		}
	},
	34: {
		id: 34,
		name: 'Angel',
		type: CARD_TYPE.HERO,
		power: 6,
		tags: [TAG.AGILITY, TAG.FLIGHT, TAG.WORTHY],
		score() {
			return this.power
		}
	},
	35: {
		id: 35,
		name: 'Beast',
		type: CARD_TYPE.HERO,
		power: 6,
		tags: [TAG.AGILITY, TAG.MUTANT, TAG.TECH],
		score() {
			return this.power
		}
	},
	36: {
		id: 36,
		name: 'Black Widow',
		type: CARD_TYPE.HERO,
		power: 6,
		tags: [TAG.AGILITY, TAG.AGILITY, TAG.INTEL],
		score() {
			return this.power
		}
	},
	37: {
		id: 37,
		name: 'Colossus',
		type: CARD_TYPE.HERO,
		power: 6,
		tags: [TAG.MUTANT, TAG.STRENGTH, TAG.STRENGTH],
		score() {
			return this.power
		}
	},
	38: {
		id: 38,
		name: 'Falcon',
		type: CARD_TYPE.HERO,
		power: 6,
		tags: [TAG.FLIGHT, TAG.RANGE, TAG.TECH],
		score() {
			return this.power
		}
	},
	39: {
		id: 39,
		name: 'Hawkeye',
		type: CARD_TYPE.HERO,
		power: 5,
		tags: [TAG.RANGE, TAG.RANGE, TAG.TECH],
		score() {
			return this.power
		}
	},
	40: {
		id: 40,
		name: 'Storm',
		type: CARD_TYPE.HERO,
		power: 4,
		tags: [TAG.FLIGHT, TAG.MUTANT, TAG.RANGE],
		score() {
			return this.power
		}
	},
	41: {
		id: 41,
		name: 'Valkyrie',
		type: CARD_TYPE.HERO,
		power: 7,
		tags: [TAG.ASGARD, TAG.FLIGHT, TAG.STRENGTH],
		score() {
			return this.power
		}
	},
	//#endregion Hero
	//#region Location
	42: {
		id: 42,
		name: 'Bifrost',
		type: CARD_TYPE.LOCATION,
		power: 0,
		tags: [TAG.ASGARD],
		score(hand) {
			const locationCount = count(hand, card => card.type === CARD_TYPE.LOCATION)
			return locationCount > 1 ? 11 : 0
		}
	},
	43: {
		id: 43,
		name: 'High Speed Chase',
		type: CARD_TYPE.LOCATION,
		power: 0,
		tags: [TAG.URBAN],
		score(hand) {
			const matchingTagCount = sumBy(hand, card =>
				count(card.modifiedTags, tag => tag === TAG.AGILITY || tag === TAG.FLIGHT || tag === TAG.RANGE)
			)
			return matchingTagCount * 3
		}
	},
	44: {
		id: 44,
		name: 'Skyscraper',
		type: CARD_TYPE.LOCATION,
		power: 0,
		tags: [TAG.URBAN],
		score(hand) {
			const matchingTagCount = sumBy(hand, card =>
				count(card.modifiedTags, tag => tag === TAG.AGILITY || tag === TAG.FLIGHT)
			)
			return matchingTagCount * 4
		}
	},
	45: {
		id: 45,
		name: 'Falling Debris',
		type: CARD_TYPE.LOCATION,
		power: 0,
		tags: [TAG.URBAN],
		score(hand) {
			const matchingTagCount = sumBy(hand, card =>
				count(card.modifiedTags, tag => tag === TAG.FLIGHT || tag === TAG.STRENGTH)
			)
			return matchingTagCount * 4
		}
	},
	46: {
		id: 46,
		name: 'Runaway Train',
		type: CARD_TYPE.LOCATION,
		power: 0,
		tags: [TAG.URBAN],
		score(hand) {
			const matchingTagCount = sumBy(hand, card =>
				count(card.modifiedTags, tag => tag === TAG.STRENGTH || tag === TAG.TECH)
			)
			return matchingTagCount * 4
		}
	},
	47: {
		id: 47,
		name: 'Krakoa, The Living Island',
		type: CARD_TYPE.LOCATION,
		power: 0,
		tags: [],
		score(hand) {
			const mutantTagCount = sumBy(hand, card => count(card.modifiedTags, tag => tag === TAG.MUTANT))
			return mutantTagCount * 5
		}
	},
	48: {
		id: 48,
		name: 'Factory',
		type: CARD_TYPE.LOCATION,
		power: 0,
		tags: [],
		score(hand) {
			const techTagCount = sumBy(hand, card =>
				count(card.modifiedTags, tag => tag === TAG.AGILITY || tag === TAG.TECH)
			)
			return techTagCount * 5
		}
	},
	49: {
		id: 49,
		name: 'Birnin Zana',
		type: CARD_TYPE.LOCATION,
		power: 0,
		tags: [TAG.TECH, TAG.URBAN, TAG.WAKANDA],
		score(hand) {
			const wakandaTagCount = sumBy(hand, card =>
				card.id !== this.id ? count(card.modifiedTags, tag => tag === TAG.WAKANDA) : 0
			)
			return wakandaTagCount * 7
		}
	},
	50: {
		id: 50,
		name: 'Madripoor',
		type: CARD_TYPE.LOCATION,
		power: 0,
		tags: [TAG.URBAN],
		score(hand) {
			const intelTagCount = sumBy(hand, card => count(card.modifiedTags, tag => tag === TAG.INTEL))
			return intelTagCount * 6
		}
	},
	51: {
		id: 51,
		name: 'Halls of Asgard',
		type: CARD_TYPE.LOCATION,
		power: 0,
		tags: [TAG.ASGARD, TAG.URBAN],
		score(hand) {
			const asgardTagCount = sumBy(hand, card =>
				card.id !== this.id ? count(card.modifiedTags, tag => tag === TAG.ASGARD) : 0
			)
			return asgardTagCount * 6
		}
	},
	52: {
		id: 52,
		name: 'Hidden Lair',
		type: CARD_TYPE.LOCATION,
		power: 16,
		tags: [],
		effect(hand, index) {
			const villains = hand.filter(card => card.type === CARD_TYPE.VILLAIN)
			villains[index].isBlanked = true
		},
		modificationOptions(hand) {
			const intelCount = sumBy(hand, card => count(card.modifiedTags, tag => tag === TAG.INTEL))
			if (intelCount > 1) {
				return 0
			}
			return count(hand, card => card.type === CARD_TYPE.VILLAIN)
		},
		score() {
			return this.power
		}
	},
	53: {
		id: 53,
		name: 'Remote Fortress',
		type: CARD_TYPE.LOCATION,
		power: 15,
		tags: [],
		effect(hand) {
			const hasBossVillain = hand.filter(
				card => card.type === CARD_TYPE.VILLAIN && card.modifiedTags.includes(TAG.BOSS) && !card.isBlanked
			)
			if (!hasBossVillain) {
				const self = findCard(hand, this.id)
				self.isBlanked = true
			}
		},
		modificationOptions() {
			return 1
		},
		score() {
			return this.power
		}
	},
	54: {
		id: 54,
		name: 'Xavier Mansion',
		type: CARD_TYPE.LOCATION,
		power: 4,
		tags: [],
		effect(hand, index) {
			const mutants = hand.filter(card => card.type === CARD_TYPE.HERO && card.modifiedTags.includes(TAG.MUTANT))
			// can choose up to three cards
			const chooseCount = Math.min(mutants.length, 3)
			const combinations = generateCombinations(mutants.length, chooseCount)

			let indexCount = index
			// Combination of selected cards, each value in the array is the index of the selected card
			let selectedCombination: number[] = []
			for (let i = 0; i < combinations.length; i++) {
				const combo = combinations[i]
				const optionCount = combo.reduce((product, current) => {
					return new Set(mutants[current].modifiedTags).size * product
				}, 1)
				if (indexCount < optionCount) {
					selectedCombination = combo
					break
				}
				indexCount -= optionCount
			}

			// Number of indices to advance before selecting the next tag to duplicate, per card.
			// e.g. the first card should wait until the rest of the cards have tried all combinations before moving to the next tag.
			const selectedCardModulos = selectedCombination.map((_, comboIndex) => {
				return selectedCombination
					.slice(comboIndex + 1)
					.reduce((product, mutantIndex) => new Set(mutants[mutantIndex].modifiedTags).size * product, 1)
			})
			selectedCombination.forEach((mutantIndex, comboIndex) => {
				const mutant = mutants[mutantIndex]
				const tagIndex = indexCount % selectedCardModulos[comboIndex]
				mutant.modifiedTags.push(mutant.modifiedTags[tagIndex])
			})
		},
		modificationOptions(hand) {
			const mutants = hand.filter(card => card.type === CARD_TYPE.HERO && card.modifiedTags.includes(TAG.MUTANT))
			// No need to try duplicating the same tag type if it was tried before
			const uniqueTagsPerCard = mutants.map(mutant => new Set(mutant.modifiedTags).size)
			// Can pick up to 3 cards, may be fewer
			const chooseCount = Math.min(mutants.length, 3)
			const combinations = generateCombinations(mutants.length, chooseCount)
			return sumBy(combinations, combo =>
				combo.reduce((product, current) => {
					return uniqueTagsPerCard[current] * product
				}, 1)
			)
		},
		score() {
			return this.power
		}
	},
	//#endregion Location
	//#region Maneuver
	55: {
		id: 55,
		name: 'Find Higher Ground',
		type: CARD_TYPE.MANEUVER,
		power: 0,
		tags: [],
		score(hand) {
			// [flightCount, rangeCount]
			const matchingTagCounts = hand.reduce(
				(counts, card) => {
					counts[0] += count(card.modifiedTags, tag => tag === TAG.FLIGHT)
					counts[1] += count(card.modifiedTags, tag => tag === TAG.RANGE)
					return counts
				},
				[0, 0]
			)

			return Math.min(...matchingTagCounts) * 10
		}
	},
	56: {
		id: 56,
		name: 'Discover Weakness',
		type: CARD_TYPE.MANEUVER,
		power: 0,
		tags: [],
		score(hand) {
			// [intelCount, AgilityCount]
			const matchingTagCounts = hand.reduce(
				(counts, card) => {
					counts[0] += count(card.modifiedTags, tag => tag === TAG.INTEL)
					counts[1] += count(card.modifiedTags, tag => tag === TAG.AGILITY)
					return counts
				},
				[0, 0]
			)

			return Math.min(...matchingTagCounts) * 11
		}
	},
	57: {
		id: 57,
		name: 'Precise Shot',
		type: CARD_TYPE.MANEUVER,
		power: 0,
		tags: [],
		score(hand) {
			// [intelCount, rangeCount]
			const matchingTagCounts = hand.reduce(
				(counts, card) => {
					counts[0] += count(card.modifiedTags, tag => tag === TAG.INTEL)
					counts[1] += count(card.modifiedTags, tag => tag === TAG.RANGE)
					return counts
				},
				[0, 0]
			)

			return Math.min(...matchingTagCounts) * 12
		}
	},
	58: {
		id: 58,
		name: 'Build Gadgets',
		type: CARD_TYPE.MANEUVER,
		power: 0,
		tags: [],
		score(hand) {
			// [techCount, intelCount]
			const matchingTagCounts = hand.reduce(
				(counts, card) => {
					counts[0] += count(card.modifiedTags, tag => tag === TAG.TECH)
					counts[1] += count(card.modifiedTags, tag => tag === TAG.INTEL)
					return counts
				},
				[0, 0]
			)

			return Math.min(...matchingTagCounts) * 13
		}
	},
	59: {
		id: 59,
		name: 'Throw Car',
		type: CARD_TYPE.MANEUVER,
		power: 0,
		tags: [TAG.RANGE],
		score(hand) {
			let hasStrength = false
			let hasUrbanLocation = false
			for (const card of hand) {
				if (card.modifiedTags.includes(TAG.STRENGTH)) {
					hasStrength = true
				}
				if (card.type === CARD_TYPE.LOCATION && card.modifiedTags.includes(TAG.URBAN)) {
					hasUrbanLocation = true
				}
				if (hasStrength && hasUrbanLocation) {
					break
				}
			}
			return hasStrength && hasUrbanLocation ? 14 : 0
		}
	},
	60: {
		id: 60,
		name: 'Avoid Crossfire',
		type: CARD_TYPE.MANEUVER,
		power: 0,
		tags: [],
		score(hand) {
			const { rangeCardCount, rangeTagCount } = hand.reduce(
				(counts, card) => {
					const rangeCount = count(card.modifiedTags, tag => tag === TAG.RANGE)
					if (rangeCount > 0) {
						counts.rangeCardCount++
						counts.rangeTagCount += rangeCount
					}
					return counts
				},
				{ rangeCardCount: 0, rangeTagCount: 0 }
			)
			const scorePerTag = rangeCardCount === 1 ? 5 : rangeCardCount === 2 ? 7 : 9
			return rangeTagCount * scorePerTag
		}
	},
	61: {
		id: 61,
		name: 'Hack In',
		type: CARD_TYPE.MANEUVER,
		power: 0,
		tags: [TAG.INTEL],
		effect(hand) {
			for (const card of hand) {
				const techCount = count(card.modifiedTags, tag => tag === TAG.TECH)
				const addIntel = Array(techCount).fill(TAG.INTEL)
				card.modifiedTags.push(...addIntel)
			}
		},
		modificationOptions() {
			return 1
		},
		score(hand) {
			const intelCount = sumBy(hand, card => count(card.modifiedTags, tag => tag === TAG.TECH))
			return intelCount * 6
		}
	},
	//#endregion Maneuver
	//#region Villain
	62: {
		id: 62,
		name: 'Kang',
		type: CARD_TYPE.VILLAIN,
		power: -10,
		tags: [],
		score(hand) {
			const tagTypes = new Set<TAG>()
			for (const card of hand) {
				for (const tag of card.modifiedTags) {
					tagTypes.add(tag)
				}
			}
			return this.power + tagTypes.size * 5
		}
	},
	63: {
		id: 63,
		name: 'Black Cat',
		type: CARD_TYPE.VILLAIN,
		power: 8,
		tags: [],
		score(hand) {
			const { hasMatchingLocation, maneuverCount } = hand.reduce(
				(status, card) => {
					if (card.type === CARD_TYPE.LOCATION && card.modifiedTags.includes(TAG.URBAN)) {
						status.hasMatchingLocation = true
					}
					if (card.type === CARD_TYPE.MANEUVER) {
						status.maneuverCount++
					}
					return status
				},
				{ hasMatchingLocation: false, maneuverCount: 0 }
			)

			return this.power + (hasMatchingLocation ? 5 : 0) + maneuverCount * -5
		}
	},
	64: {
		id: 64,
		name: 'Sauron',
		type: CARD_TYPE.VILLAIN,
		power: -7,
		tags: [],
		score(hand) {
			const matchingTagCount = sumBy(hand, card =>
				count(card.modifiedTags, tag => tag === TAG.FLIGHT || tag === TAG.RANGE)
			)
			return this.power + matchingTagCount * 7
		}
	},
	65: {
		id: 65,
		name: 'Killmonger',
		type: CARD_TYPE.VILLAIN,
		power: -9,
		tags: [TAG.WAKANDA],
		score(hand) {
			const wakandaCount = sumBy(hand, card =>
				card.id === this.id ? 0 : count(card.modifiedTags, tag => tag === TAG.WAKANDA)
			)
			return this.power + wakandaCount * 9
		}
	},
	66: {
		id: 66,
		name: 'Mystique',
		type: CARD_TYPE.VILLAIN,
		power: 14,
		tags: [TAG.MUTANT],
		score(hand) {
			const cardTagCount: number[] = []
			let intelCount = 0
			for (const card of hand) {
				intelCount += count(card.modifiedTags, tag => tag === TAG.INTEL)
				if (intelCount > 1) break
				for (const tag of card.modifiedTags) {
					cardTagCount[tag] = (cardTagCount[tag] || 0) + 1
				}
			}
			return this.power + (intelCount > 1 || cardTagCount.some(c => c > 2) ? 0 : -20)
		}
	},
	67: {
		id: 67,
		name: 'Sentinels',
		type: CARD_TYPE.VILLAIN,
		power: 12,
		tags: [],
		score(hand) {
			const mutantCount = sumBy(hand, card => count(card.modifiedTags, tag => tag === TAG.MUTANT))
			return this.power + (mutantCount > 1 ? 0 : -20)
		}
	},
	68: {
		id: 68,
		name: 'Abomination',
		type: CARD_TYPE.VILLAIN,
		power: 13,
		tags: [TAG.GAMMA],
		score(hand) {
			const strengthCount = sumBy(hand, card => count(card.modifiedTags, tag => tag === TAG.STRENGTH))
			return this.power + (strengthCount > 1 ? 0 : -20)
		}
	},
	69: {
		id: 69,
		name: 'Ultron',
		type: CARD_TYPE.VILLAIN,
		power: 14,
		tags: [TAG.BOSS],
		score(hand) {
			const techCount = sumBy(hand, card => count(card.modifiedTags, tag => tag === TAG.TECH))
			return this.power + (techCount > 1 ? 0 : -20)
		}
	},
	70: {
		id: 70,
		name: 'Hela',
		type: CARD_TYPE.VILLAIN,
		power: 18,
		tags: [TAG.ASGARD],
		score(hand) {
			const asgardCount = sumBy(hand, card =>
				card.id === this.id ? 0 : count(card.modifiedTags, tag => tag === TAG.ASGARD)
			)
			return this.power + (asgardCount > 1 ? 0 : -20)
		}
	},
	71: {
		id: 71,
		name: 'The Leader',
		type: CARD_TYPE.VILLAIN,
		power: 12,
		tags: [TAG.BOSS, TAG.GAMMA],
		score(hand) {
			const matchingTagCount = sumBy(hand, card =>
				count(card.modifiedTags, tag => tag === TAG.STRENGTH || (card.id !== this.id && tag === TAG.GAMMA))
			)
			return this.power + (matchingTagCount > 1 ? 0 : -20)
		}
	},
	72: {
		id: 72,
		name: 'Baron Zemo',
		type: CARD_TYPE.VILLAIN,
		power: 15,
		tags: [TAG.BOSS],
		score(hand) {
			const heroCount = count(hand, card => card.type === CARD_TYPE.HERO)
			return this.power + heroCount * -3
		}
	},
	73: {
		id: 73,
		name: 'Loki',
		type: CARD_TYPE.VILLAIN,
		power: 15,
		tags: [TAG.ASGARD],
		score() {
			// TODO: handle card draw here?
			return this.power
		}
	},
	74: {
		id: 74,
		name: 'Magneto',
		type: CARD_TYPE.VILLAIN,
		power: 17,
		tags: [TAG.BOSS, TAG.MUTANT],
		effect(hand) {
			for (const card of hand) {
				if (card.type === CARD_TYPE.EQUIPMENT) {
					card.isBlanked = true
				}
				card.modifiedTags = card.modifiedTags.filter(tag => tag !== TAG.TECH)
			}
		},
		modificationOptions() {
			return 1
		},
		score() {
			return this.power
		}
	},
	75: {
		id: 75,
		name: 'Taskmaster',
		type: CARD_TYPE.VILLAIN,
		power: 11,
		tags: [],
		effect(hand) {
			for (const card of hand) {
				if (card.type === CARD_TYPE.MANEUVER) {
					card.isBlanked = true
				}
			}
		},
		modificationOptions() {
			return 1
		},
		score() {
			return this.power
		}
	},
	76: {
		id: 76,
		name: 'Selene',
		type: CARD_TYPE.VILLAIN,
		power: 25,
		tags: [TAG.MUTANT],
		effect(hand, index) {
			const heroesAndAllies = hand.filter(card => card.type === CARD_TYPE.HERO || card.type === CARD_TYPE.ALLY)
			const selectedCard = heroesAndAllies[index]
			selectedCard.isBlanked = true
			const self = findCard(hand, this.id)
			// TODO: does this count the transformed powers of heroes?
			self.modifiedPower = this.power - selectedCard.power
		},
		modificationOptions(hand) {
			return count(hand, card => card.type === CARD_TYPE.HERO || card.type === CARD_TYPE.ALLY)
		},
		score(hand) {
			const self = findCard(hand, this.id)
			return self.modifiedPower
		}
	},
	77: {
		id: 77,
		name: 'Juggernaut',
		type: CARD_TYPE.VILLAIN,
		power: 16,
		tags: [TAG.MUTANT],
		effect(hand, index) {
			const locations = hand.filter(card => card.type === CARD_TYPE.LOCATION)
			locations[index].isBlanked = true
		},
		modificationOptions(hand) {
			return count(hand, card => card.type === CARD_TYPE.LOCATION)
		},
		score() {
			return this.power
		}
	},
	78: {
		id: 78,
		name: 'Kingpin',
		type: CARD_TYPE.VILLAIN,
		power: 13,
		tags: [TAG.BOSS],
		effect(hand) {
			const hasMatchingLocation = hand.some(
				card => card.type === CARD_TYPE.LOCATION && card.modifiedTags.includes(TAG.URBAN)
			)
			if (!hasMatchingLocation) {
				const self = findCard(hand, this.id)
				self.isBlanked = true
			}
		},
		modificationOptions() {
			return 1
		},
		score() {
			return this.power
		}
	},
	79: {
		id: 79,
		name: 'Toad',
		type: CARD_TYPE.VILLAIN,
		power: 14,
		tags: [TAG.MUTANT],
		effect(hand) {
			const hasMatchingVillain = hand.some(card => card.type === CARD_TYPE.VILLAIN && card.modifiedTags.includes(TAG.BOSS))
			if (!hasMatchingVillain) {
				const self = findCard(hand, this.id)
				self.isBlanked = true
			}
		},
		modificationOptions() {
			return 1
		},
		score() {
			return this.power
		}
	}
	//#endregion Villain
}
