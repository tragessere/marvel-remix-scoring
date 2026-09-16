import sumBy from 'lodash-es/sumBy'
import { Card, CARD_TYPE, ModifiedCard, TAG } from '../types/card.ts'
import { findCard, removeTag } from '../utils/card.ts'
import { generateCombinations } from '../utils/randomization.ts'
import { count } from '../utils/whyIsThisNotInLodash.ts'

export const cardList: Readonly<Record<number, Card>> = {
	//#region Marvel Remix
	//#region Ally
	1: {
		// Forge
		id: 1,
		type: CARD_TYPE.ALLY,
		power: 4,
		tags: [TAG.TECH, TAG.MUTANT],
		bonusValue: 4,
		score(hand) {
			const equipmentCount = count(hand, card => card.type === CARD_TYPE.EQUIPMENT)
			return this.power + equipmentCount * 4
		}
	},
	2: {
		// Heimdall
		id: 2,
		type: CARD_TYPE.ALLY,
		power: 4,
		tags: [TAG.INTEL, TAG.ASGARD],
		bonusValue: 6,
		score(hand) {
			const containsBifrost = hand.some(card => card.id === 42)
			return this.power + (containsBifrost ? 6 : 0)
		}
	},
	3: {
		// Lockheed
		id: 3,
		type: CARD_TYPE.ALLY,
		power: 5,
		tags: [TAG.FLIGHT, TAG.RANGE],
		bonusValue: 7,
		score(hand) {
			const containsShadowcat = hand.some(card => card.id === 21)
			return this.power + (containsShadowcat ? 7 : 0)
		}
	},
	4: {
		// Jane Foster
		id: 4,
		type: CARD_TYPE.ALLY,
		power: 5,
		tags: [TAG.TECH, TAG.WORTHY],
		bonusValue: 8,
		score(hand) {
			const containsThor = hand.some(card => card.id === 30)
			return this.power + (containsThor ? 8 : 0)
		}
	},
	5: {
		// Moira Mactaggert
		id: 5,
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
		// Dora Milaje
		id: 6,
		type: CARD_TYPE.ALLY,
		power: 6,
		tags: [TAG.INTEL, TAG.AGILITY, TAG.WAKANDA],
		score() {
			return this.power
		}
	},
	7: {
		// Hulk Operations
		id: 7,
		type: CARD_TYPE.ALLY,
		power: 4,
		tags: [TAG.TECH, TAG.RANGE, TAG.GAMMA],
		score() {
			return this.power
		}
	},
	//#endregion Ally
	//#region Condition
	8: {
		// Assembled
		id: 8,
		type: CARD_TYPE.CONDITION,
		power: 0,
		tags: [],
		score(hand) {
			const heroCount = count(hand, card => card.type === CARD_TYPE.HERO)
			return heroCount * 4
		}
	},
	9: {
		// Fearless
		id: 9,
		type: CARD_TYPE.CONDITION,
		power: 16,
		tags: [TAG.AGILITY],
		transform(hand, self) {
			self.isBlanked = count(hand, card => card.type === CARD_TYPE.HERO) > 1
		},
		score() {
			return this.power
		}
	},
	10: {
		// Secret ID
		id: 10,
		type: CARD_TYPE.CONDITION,
		power: 8,
		tags: [TAG.INTEL],
		transform(hand, self) {
			const hasHero = hand.some(card => card.type === CARD_TYPE.HERO)
			const hasUrbanLocation = hand.some(
				card => card.type === CARD_TYPE.LOCATION && card.modifiedTags.includes(TAG.URBAN)
			)
			self.isBlanked = !(hasHero && hasUrbanLocation)
		},
		score() {
			return this.power
		}
	},
	11: {
		// Worthy
		id: 11,
		type: CARD_TYPE.CONDITION,
		power: 11,
		tags: [TAG.WORTHY],
		transform(hand, self) {
			self.isBlanked = !hand.some(card => card.type === CARD_TYPE.VILLAIN && card.modifiedPower > 12)
		},
		score() {
			return this.power
		}
	},
	12: {
		// Berserk
		id: 12,
		type: CARD_TYPE.CONDITION,
		power: 18,
		tags: [TAG.STRENGTH, TAG.GAMMA],
		negativeValue: -3,
		score(hand) {
			let heroOrAllyCount = count(hand, card => card.type === CARD_TYPE.HERO || card.type === CARD_TYPE.ALLY)
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
		// Spear of Bashenga
		id: 13,
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
		// Arc Reactor
		id: 14,
		type: CARD_TYPE.EQUIPMENT,
		power: 0,
		tags: [],
		score(hand) {
			const techCount = sumBy(hand, card => count(card.modifiedTags, tag => tag === TAG.TECH))
			return techCount * 9
		}
	},
	15: {
		// X-Jet
		id: 15,
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
			const selfIndex = hand.findIndex(card => card.id === this.id)
			if (hand.some((card, index) => card.id === 33 && index > selfIndex)) {
				throw new Error('X-Jet must be evaluated after Vision')
			}
			return count(
				hand,
				card => !card.isBlanked && (card.type === CARD_TYPE.HERO || card.type === CARD_TYPE.ALLY)
			)
		},
		score() {
			return this.power
		}
	},
	16: {
		// Vibranium Shield
		id: 16,
		type: CARD_TYPE.EQUIPMENT,
		power: 9,
		tags: [TAG.STRENGTH, TAG.RANGE],
		transform(hand, self) {
			self.isBlanked = !hand.some(c => c.type === CARD_TYPE.HERO && c.modifiedTags.includes(TAG.AGILITY))
		},
		score() {
			return this.power
		}
	},
	17: {
		// Mjolnir
		id: 17,
		type: CARD_TYPE.EQUIPMENT,
		power: 10,
		tags: [TAG.FLIGHT, TAG.RANGE, TAG.ASGARD],
		transform(hand, self) {
			self.isBlanked = !hand.some(
				c =>
					// 'Worthy' card
					(!c.isBlanked && c.id === 11) ||
					// Any 'Hero' or 'Ally' with the 'Worthy' tag
					((c.type === CARD_TYPE.HERO || c.type === CARD_TYPE.ALLY) && c.tags.includes(TAG.WORTHY))
			)
		},
		score() {
			return this.power
		}
	},
	18: {
		// Cerebro
		id: 18,
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
		// Captain America
		id: 19,
		type: CARD_TYPE.HERO,
		power: 4,
		tags: [TAG.AGILITY, TAG.WORTHY],
		bonusValue: 4,
		score(hand) {
			const heroCount = count(hand, card => card.type === CARD_TYPE.HERO && card.id !== 19)
			const hasShield = hand.some(card => card.id === 16)
			return this.power + heroCount * 2 + (hasShield ? 4 : 0)
		}
	},
	20: {
		// Cyclops
		id: 20,
		type: CARD_TYPE.HERO,
		power: 4,
		tags: [TAG.RANGE, TAG.MUTANT],
		bonusValue: 3,
		score(hand) {
			const mutantCount = sumBy(hand, card =>
				card.id !== 20 ? count(card.modifiedTags, t => t === TAG.MUTANT) : 0
			)
			return this.power + mutantCount * 3
		}
	},
	21: {
		// Shadowcat
		id: 21,
		type: CARD_TYPE.HERO,
		power: 4,
		tags: [TAG.TECH, TAG.MUTANT],
		bonusValue: 4,
		score(hand) {
			const hasLocation = hand.some(card => card.type === CARD_TYPE.LOCATION)
			return this.power + (hasLocation ? 4 : 0)
		}
	},
	22: {
		// Spider-Man
		id: 22,
		type: CARD_TYPE.HERO,
		power: 5,
		tags: [TAG.STRENGTH, TAG.AGILITY],
		bonusValue: 5,
		effect(hand) {
			const hasMatchingLocation = hand.some(
				c => c.type === CARD_TYPE.LOCATION && c.modifiedTags.includes(TAG.URBAN)
			)
			if (hasMatchingLocation) {
				const self = findCard(hand, this.id)
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
		// She-Hulk
		id: 23,
		type: CARD_TYPE.HERO,
		power: 4,
		tags: [TAG.STRENGTH, TAG.GAMMA],
		bonusValue: 5,
		score(hand) {
			const gammaCount = sumBy(hand, card =>
				card.id !== this.id ? count(card.modifiedTags, t => t === TAG.GAMMA) : 0
			)
			return this.power + gammaCount * 5
		}
	},
	24: {
		// Black Panther
		id: 24,
		type: CARD_TYPE.HERO,
		power: 4,
		tags: [TAG.AGILITY, TAG.WAKANDA],
		bonusValue: 5,
		score(hand) {
			const wakandaCount = sumBy(hand, card =>
				card.id !== this.id ? count(card.modifiedTags, t => t === TAG.WAKANDA) : 0
			)
			return this.power + wakandaCount * 5
		}
	},
	25: {
		// Professor X
		id: 25,
		type: CARD_TYPE.HERO,
		power: 3,
		tags: [TAG.INTEL, TAG.MUTANT],
		bonusValue: 6,
		score(hand) {
			const hasCerebro = hand.some(card => card.id === 18)
			const hasMansion = hand.some(card => card.id === 54)
			return this.power + (hasCerebro ? 6 : 0) + (hasMansion ? 6 : 0)
		}
	},
	26: {
		// Wolverine
		id: 26,
		type: CARD_TYPE.HERO,
		power: 4,
		tags: [TAG.AGILITY, TAG.MUTANT],
		bonusValue: 6,
		score(hand) {
			const hasMatchingVillain = hand.some(c => c.type === CARD_TYPE.VILLAIN && c.modifiedTags.includes(TAG.BOSS))
			return this.power + (hasMatchingVillain ? 6 : 0)
		}
	},
	27: {
		// Rogue
		id: 27,
		type: CARD_TYPE.HERO,
		power: 0,
		tags: [TAG.MUTANT],
		effect(hand, index) {
			let indexCount = index
			const targetCard = hand.find(card => {
				if (
					!card.isBlanked &&
					card.type === CARD_TYPE.HERO &&
					card.id !== this.id &&
					card.modifiedTags.length > 0
				) {
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
			return sumBy(hand, card =>
				card.type === CARD_TYPE.HERO && card.id !== this.id && !card.isBlanked ? card.modifiedTags.length : 0
			)
		},
		score(cards) {
			const self = findCard(cards, 27)
			return self.modifiedPower
		}
	},
	28: {
		// Shuri
		id: 28,
		type: CARD_TYPE.HERO,
		power: 2,
		tags: [TAG.TECH, TAG.WAKANDA],
		effect(hand, index) {
			const tagOptions = [TAG.AGILITY, TAG.RANGE, TAG.STRENGTH]
			const ownTagChoice = tagOptions[index % 3]

			const self = findCard(hand, this.id)
			self.modifiedTags.push(ownTagChoice)

			const targetCards = hand.filter(
				card => (card.id !== this.id && card.type === CARD_TYPE.HERO) || card.type === CARD_TYPE.ALLY
			)
			if (targetCards.length === 0) return

			const targetCardSelectionIndex = Math.floor(index / 9)
			const targetCardTagChoice = Math.floor((index % 9) / 3)
			const targetCard = targetCards[targetCardSelectionIndex]
			targetCard.modifiedTags.push(tagOptions[targetCardTagChoice])
		},
		modificationOptions(hand) {
			const targetCardCount = count(
				hand,
				card => card.id !== this.id && (card.type === CARD_TYPE.HERO || card.type === CARD_TYPE.ALLY)
			)
			// 3 options if Shuri is the only hero/ally.
			// Otherwise, 3 options for Shuri times 3 for the target card times the number of target cards
			return targetCardCount === 0 ? 3 : targetCardCount * 9
		},
		score() {
			return this.power
		}
	},
	29: {
		// Bruce Banner
		id: 29,
		type: CARD_TYPE.HERO,
		power: 1,
		tags: [TAG.TECH, TAG.GAMMA],
		transformedTags: [TAG.STRENGTH, TAG.STRENGTH, TAG.STRENGTH, TAG.GAMMA],
		transform(hand, self) {
			const isTransformed = !!self.isTransformed
			const shouldTransform = hand.some(
				card => card !== self && !card.isBlanked && card.modifiedTags.includes(TAG.GAMMA)
			)

			if (isTransformed === shouldTransform) {
				return
			}

			if (shouldTransform) {
				self.isTransformed = true
				self.modifiedPower = 13
				removeTag(self, TAG.TECH)
				self.modifiedTags.push(TAG.STRENGTH, TAG.STRENGTH, TAG.STRENGTH)
			} else {
				self.isTransformed = false
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
		// Thor Odinson
		id: 30,
		type: CARD_TYPE.HERO,
		power: 4,
		tags: [TAG.STRENGTH, TAG.ASGARD, TAG.WORTHY],
		transformedTags: [TAG.STRENGTH, TAG.FLIGHT, TAG.RANGE, TAG.ASGARD, TAG.WORTHY],
		transform(hand, self) {
			const isTransformed = !!self.isTransformed
			const hasMjolnir = hand.some(card => card.id === 17 && !card.isBlanked)
			const allyCount = count(hand, card => card.type === CARD_TYPE.ALLY && !card.isBlanked)
			const shouldTransform = hasMjolnir || allyCount > 1

			if (isTransformed === shouldTransform) {
				return
			}

			if (shouldTransform) {
				self.isTransformed = true
				self.modifiedPower = 12
				self.modifiedTags.push(TAG.FLIGHT, TAG.RANGE)
			} else {
				self.isTransformed = false
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
		// Tony Stark
		id: 31,
		type: CARD_TYPE.HERO,
		power: 3,
		tags: [TAG.TECH, TAG.RANGE],
		transformedTags: [TAG.TECH, TAG.STRENGTH, TAG.FLIGHT, TAG.RANGE],
		transform(hand, self) {
			const isTransformed = !!self.isTransformed
			const shouldTransform = sumBy(hand, card => count(card.modifiedTags, t => t === TAG.INTEL)) > 1

			if (isTransformed === shouldTransform) {
				return
			}

			if (shouldTransform) {
				self.isTransformed = true
				self.modifiedPower = 8
				self.modifiedTags.push(TAG.FLIGHT, TAG.STRENGTH)
			} else {
				self.isTransformed = false
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
		// Jean Grey
		id: 32,
		type: CARD_TYPE.HERO,
		power: 3,
		tags: [TAG.INTEL, TAG.RANGE, TAG.MUTANT],
		transformedTags: [TAG.INTEL, TAG.RANGE, TAG.RANGE, TAG.FLIGHT, TAG.MUTANT],
		transform(hand, self) {
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
				self.modifiedPower = 9
				self.modifiedTags.push(TAG.FLIGHT)
				self.modifiedTags.push(TAG.RANGE)
			} else {
				self.isTransformed = false
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
		// Vision
		id: 33,
		type: CARD_TYPE.HERO,
		power: 3,
		tags: [TAG.WORTHY],
		effect(hand, index) {
			const self = findCard(hand, this.id)
			const options = [TAG.FLIGHT, TAG.RANGE, TAG.STRENGTH, TAG.TECH]
			let optionIndex = 0
			for (let i = 0; i < options.length - 1; i++) {
				for (let j = i + 1; j < options.length; j++) {
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
		// Angel
		id: 34,
		type: CARD_TYPE.HERO,
		power: 6,
		tags: [TAG.AGILITY, TAG.FLIGHT, TAG.MUTANT],
		score() {
			return this.power
		}
	},
	35: {
		// Beast
		id: 35,
		type: CARD_TYPE.HERO,
		power: 6,
		tags: [TAG.TECH, TAG.AGILITY, TAG.MUTANT],
		score() {
			return this.power
		}
	},
	36: {
		// Black Widow
		id: 36,
		type: CARD_TYPE.HERO,
		power: 6,
		tags: [TAG.INTEL, TAG.AGILITY, TAG.AGILITY],
		score() {
			return this.power
		}
	},
	37: {
		// Colossus
		id: 37,
		type: CARD_TYPE.HERO,
		power: 6,
		tags: [TAG.STRENGTH, TAG.STRENGTH, TAG.MUTANT],
		score() {
			return this.power
		}
	},
	38: {
		// Falcon
		id: 38,
		type: CARD_TYPE.HERO,
		power: 6,
		tags: [TAG.TECH, TAG.FLIGHT, TAG.RANGE],
		score() {
			return this.power
		}
	},
	39: {
		// Hawkeye
		id: 39,
		type: CARD_TYPE.HERO,
		power: 5,
		tags: [TAG.TECH, TAG.RANGE, TAG.RANGE],
		score() {
			return this.power
		}
	},
	40: {
		// Storm
		id: 40,
		type: CARD_TYPE.HERO,
		power: 4,
		tags: [TAG.FLIGHT, TAG.RANGE, TAG.MUTANT],
		score() {
			return this.power
		}
	},
	41: {
		// Valkyrie
		id: 41,
		type: CARD_TYPE.HERO,
		power: 7,
		tags: [TAG.STRENGTH, TAG.FLIGHT, TAG.ASGARD],
		score() {
			return this.power
		}
	},
	//#endregion Hero
	//#region Location
	42: {
		// Bifrost
		id: 42,
		type: CARD_TYPE.LOCATION,
		power: 0,
		tags: [TAG.ASGARD],
		score(hand) {
			const locationCount = count(hand, card => card.type === CARD_TYPE.LOCATION)
			return locationCount > 1 ? 11 : 0
		}
	},
	43: {
		// High Speed Chase
		id: 43,
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
		// Skyscraper
		id: 44,
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
		// Falling Debris
		id: 45,
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
		// Runaway Train
		id: 46,
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
		// Krakoa, The Living Island
		id: 47,
		type: CARD_TYPE.LOCATION,
		power: 0,
		tags: [],
		score(hand) {
			const mutantTagCount = sumBy(hand, card => count(card.modifiedTags, tag => tag === TAG.MUTANT))
			return mutantTagCount * 5
		}
	},
	48: {
		// Factory
		id: 48,
		type: CARD_TYPE.LOCATION,
		power: 0,
		tags: [],
		score(hand) {
			const techAgilityTagCount = sumBy(hand, card =>
				count(card.modifiedTags, tag => tag === TAG.AGILITY || tag === TAG.TECH)
			)
			return techAgilityTagCount * 5
		}
	},
	49: {
		// Birnin Zana
		id: 49,
		type: CARD_TYPE.LOCATION,
		power: 0,
		tags: [TAG.TECH, TAG.WAKANDA, TAG.URBAN],
		score(hand) {
			const wakandaTagCount = sumBy(hand, card =>
				card.id !== this.id ? count(card.modifiedTags, tag => tag === TAG.WAKANDA) : 0
			)
			return wakandaTagCount * 7
		}
	},
	50: {
		// Madripoor
		id: 50,
		type: CARD_TYPE.LOCATION,
		power: 0,
		tags: [TAG.URBAN],
		score(hand) {
			const intelTagCount = sumBy(hand, card => count(card.modifiedTags, tag => tag === TAG.INTEL))
			return intelTagCount * 8
		}
	},
	51: {
		// Halls of Asgard
		id: 51,
		type: CARD_TYPE.LOCATION,
		power: 0,
		tags: [TAG.ASGARD, TAG.URBAN],
		score(hand) {
			const asgardTagCount = sumBy(hand, card =>
				card.id !== this.id ? count(card.modifiedTags, tag => tag === TAG.ASGARD) : 0
			)
			return asgardTagCount * 9
		}
	},
	52: {
		// Hidden Lair
		id: 52,
		type: CARD_TYPE.LOCATION,
		power: 16,
		tags: [],
		effect(hand, index) {
			const selfIndex = hand.findIndex(card => card.id === this.id)
			const villains = hand.filter((card, index) => index > selfIndex && card.type === CARD_TYPE.VILLAIN)
			villains[index].isBlanked = true
		},
		modificationOptions(hand) {
			const intelCount = sumBy(hand, card => count(card.modifiedTags, tag => tag === TAG.INTEL))
			if (intelCount > 1) {
				return 0
			}
			const selfIndex = hand.findIndex(card => card.id === this.id)
			const usedCards = hand.slice(0, selfIndex)
			const usedOptions = count(usedCards, card => card.type === CARD_TYPE.VILLAIN)
			const unusedCards = hand.slice(selfIndex + 1)
			const unusedOptions = count(unusedCards, card => card.type === CARD_TYPE.VILLAIN)
			if (usedOptions && !unusedOptions) {
				throw new Error('All card options already used')
			}
			return unusedOptions
		},
		score() {
			return this.power
		}
	},
	53: {
		// Remote Fortress
		id: 53,
		type: CARD_TYPE.LOCATION,
		power: 15,
		tags: [],
		transform(hand, self) {
			self.isBlanked = !hand.some(card => card.type === CARD_TYPE.VILLAIN && card.modifiedTags.includes(TAG.BOSS))
		},
		score() {
			return this.power
		}
	},
	54: {
		// Xavier Mansion
		id: 54,
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
		// Find Higher Ground
		id: 55,
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
		// Discover Weakness
		id: 56,
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
		// Precise Shot
		id: 57,
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
		// Build Gadgets
		id: 58,
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
		// Throw Car
		id: 59,
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
		// Avoid Crossfire
		id: 60,
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
		// Hack In
		id: 61,
		type: CARD_TYPE.MANEUVER,
		power: 0,
		tags: [TAG.INTEL],
		effect(hand) {
			for (const card of hand) {
				const techCount = count(card.modifiedTags, tag => tag === TAG.TECH)
				const addIntel = Array<TAG>(techCount).fill(TAG.INTEL)
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
		// Kang
		id: 62,
		type: CARD_TYPE.VILLAIN,
		power: -10,
		tags: [],
		bonusValue: 5,
		negativeValue: -10,
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
		// Black Cat
		id: 63,
		type: CARD_TYPE.VILLAIN,
		power: 8,
		tags: [],
		bonusValue: -5,
		negativeValue: -5,
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
		// Sauron
		id: 64,
		type: CARD_TYPE.VILLAIN,
		power: -7,
		tags: [],
		bonusValue: 7,
		negativeValue: -7,
		score(hand) {
			const matchingTagCount = sumBy(hand, card =>
				count(card.modifiedTags, tag => tag === TAG.FLIGHT || tag === TAG.RANGE)
			)
			return this.power + matchingTagCount * 7
		}
	},
	65: {
		// Killmonger
		id: 65,
		type: CARD_TYPE.VILLAIN,
		power: -9,
		tags: [TAG.WAKANDA],
		bonusValue: 9,
		negativeValue: -9,
		score(hand) {
			const wakandaCount = sumBy(hand, card =>
				card.id === this.id ? 0 : count(card.modifiedTags, tag => tag === TAG.WAKANDA)
			)
			return this.power + wakandaCount * 9
		}
	},
	66: {
		// Mystique
		id: 66,
		type: CARD_TYPE.VILLAIN,
		power: 14,
		tags: [TAG.MUTANT],
		negativeValue: -20,
		score(hand) {
			const cardTagCount: number[] = []
			let intelCount = 0
			for (const card of hand) {
				intelCount += count(card.modifiedTags, tag => tag === TAG.INTEL)
				if (intelCount > 1) break
				const tagSet = new Set<TAG>(card.modifiedTags)
				for (const tag of tagSet) {
					cardTagCount[tag] = (cardTagCount[tag] || 0) + 1
				}
			}
			return this.power + (intelCount > 1 || cardTagCount.some(c => c > 2) ? 0 : -20)
		}
	},
	67: {
		// Sentinels
		id: 67,
		type: CARD_TYPE.VILLAIN,
		power: 12,
		tags: [],
		negativeValue: -20,
		score(hand) {
			const mutantCount = sumBy(hand, card => count(card.modifiedTags, tag => tag === TAG.MUTANT))
			return this.power + (mutantCount > 1 ? 0 : -20)
		}
	},
	68: {
		// Abomination
		id: 68,
		type: CARD_TYPE.VILLAIN,
		power: 13,
		tags: [TAG.GAMMA],
		negativeValue: -20,
		score(hand) {
			const strengthCount = sumBy(hand, card => count(card.modifiedTags, tag => tag === TAG.STRENGTH))
			return this.power + (strengthCount > 1 ? 0 : -20)
		}
	},
	69: {
		// Ultron
		id: 69,
		type: CARD_TYPE.VILLAIN,
		power: 14,
		tags: [TAG.BOSS],
		negativeValue: -20,
		score(hand) {
			const techCount = sumBy(hand, card => count(card.modifiedTags, tag => tag === TAG.TECH))
			return this.power + (techCount > 1 ? 0 : -20)
		}
	},
	70: {
		// Hela
		id: 70,
		type: CARD_TYPE.VILLAIN,
		power: 18,
		tags: [TAG.ASGARD],
		negativeValue: -20,
		score(hand) {
			const asgardCount = sumBy(hand, card =>
				card.id === this.id ? 0 : count(card.modifiedTags, tag => tag === TAG.ASGARD)
			)
			return this.power + (asgardCount > 1 ? 0 : -20)
		}
	},
	71: {
		// The Leader
		id: 71,
		type: CARD_TYPE.VILLAIN,
		power: 12,
		tags: [TAG.GAMMA, TAG.BOSS],
		bonusValue: -3,
		negativeValue: -3,
		score(hand) {
			const matchingTagCount = sumBy(hand, card =>
				count(card.modifiedTags, tag => tag === TAG.STRENGTH || (card.id !== this.id && tag === TAG.GAMMA))
			)
			return this.power - matchingTagCount * 3
		}
	},
	72: {
		// Baron Zemo
		id: 72,
		type: CARD_TYPE.VILLAIN,
		power: 15,
		tags: [TAG.BOSS],
		bonusValue: -3,
		negativeValue: -3,
		score(hand) {
			const heroCount = count(hand, card => card.type === CARD_TYPE.HERO)
			return this.power - heroCount * 3
		}
	},
	73: {
		// Loki
		id: 73,
		type: CARD_TYPE.VILLAIN,
		power: 15,
		tags: [TAG.ASGARD],
		score() {
			return this.power
		}
	},
	74: {
		// Magneto
		id: 74,
		type: CARD_TYPE.VILLAIN,
		power: 17,
		tags: [TAG.MUTANT, TAG.BOSS],
		effect(hand) {
			for (const card of hand) {
				if (card.type === CARD_TYPE.EQUIPMENT) {
					card.isBlanked = true
				}
				card.modifiedTags = card.modifiedTags.filter(tag => tag !== TAG.TECH)
			}
		},
		modificationOptions(hand) {
			const selfIndex = hand.findIndex(card => card.id === this.id)
			if (hand.some((card, index) => card.id === 61 && index < selfIndex)) {
				throw new Error('Using Magneto after Hack In')
			}
			if (hand.some((card, index) => card.type === CARD_TYPE.EQUIPMENT && index < selfIndex)) {
				throw new Error('Trying to blank a used card')
			}
			return 1
		},
		score() {
			return this.power
		}
	},
	75: {
		// Taskmaster
		id: 75,
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
		modificationOptions(hand) {
			const selfIndex = hand.findIndex(card => card.id === this.id)
			if (hand.some((card, index) => card.type === CARD_TYPE.MANEUVER && index < selfIndex)) {
				throw new Error('Trying to blank a used card')
			}
			return 1
		},
		score() {
			return this.power
		}
	},
	76: {
		// Selene
		id: 76,
		type: CARD_TYPE.VILLAIN,
		power: 25,
		tags: [TAG.MUTANT],
		effect(hand, index) {
			const selfIndex = hand.findIndex(card => card.id === this.id)
			const heroesAndAllies = hand.filter(
				(card, index) => index > selfIndex && (card.type === CARD_TYPE.HERO || card.type === CARD_TYPE.ALLY)
			)
			const selectedCard = heroesAndAllies[index]
			selectedCard.isBlanked = true
			const self = findCard(hand, this.id)
			// Use modified power to include hero transformations. Check for Rogue card who's modifiedPower can also change, but base power counts as 0.
			self.modifiedPower = this.power - (selectedCard.id === 27 ? 0 : selectedCard.modifiedPower)
		},
		modificationOptions(hand) {
			const selfIndex = hand.findIndex(card => card.id === this.id)
			const { availableOptions, pastOptions } = hand.reduce(
				(acc, card, i) => {
					if (card.type === CARD_TYPE.HERO || card.type === CARD_TYPE.ALLY) {
						if (i < selfIndex) {
							acc.pastOptions++
						} else {
							acc.availableOptions++
						}
					}
					return acc
				},
				{ availableOptions: 0, pastOptions: 0 }
			)
			if (pastOptions && !availableOptions) {
				throw new Error('All card options already used')
			}
			return availableOptions
		},
		score(hand) {
			const self = findCard(hand, this.id)
			return self.modifiedPower
		}
	},
	77: {
		// Juggernaut
		id: 77,
		type: CARD_TYPE.VILLAIN,
		power: 16,
		tags: [TAG.MUTANT],
		effect(hand, index) {
			const selfIndex = hand.findIndex(card => card.id === this.id)
			const locations = hand.filter((card, index) => card.type === CARD_TYPE.LOCATION && index > selfIndex)
			locations[index].isBlanked = true
		},
		modificationOptions(hand) {
			const selfIndex = hand.findIndex(card => card.id === this.id)
			const { availableOptions, pastOptions } = hand.reduce(
				(acc, card, i) => {
					if (card.type === CARD_TYPE.LOCATION) {
						if (i < selfIndex) {
							acc.pastOptions++
						} else {
							acc.availableOptions++
						}
					}
					return acc
				},
				{ availableOptions: 0, pastOptions: 0 }
			)

			if (pastOptions && !availableOptions) {
				throw new Error('All card options already used')
			}
			return availableOptions
		},
		score() {
			return this.power
		}
	},
	78: {
		// Kingpin
		id: 78,
		type: CARD_TYPE.VILLAIN,
		power: 13,
		tags: [TAG.BOSS],
		transform(hand, self) {
			self.isBlanked = !hand.some(
				card => card.type === CARD_TYPE.LOCATION && card.modifiedTags.includes(TAG.URBAN)
			)
		},
		modificationOptions() {
			return 1
		},
		score() {
			return this.power
		}
	},
	79: {
		// Toad
		id: 79,
		type: CARD_TYPE.VILLAIN,
		power: 14,
		tags: [TAG.MUTANT],
		transform(hand, self) {
			self.isBlanked = !hand.some(
				card => card.type === CARD_TYPE.VILLAIN && card.modifiedTags.includes(TAG.BOSS) && card.id !== this.id
			)
		},
		score() {
			return this.power
		}
	},
	//#endregion Villain
	//#region Promo
	80: {
		// Squirrel Girl
		id: 80,
		type: CARD_TYPE.HERO,
		power: 1,
		tags: [],
		effect(hand) {
			for (const card of hand) {
				if (card.type === CARD_TYPE.VILLAIN) {
					card.isTextBlanked = true
					card.modifiedPower = Math.abs(card.power)
				}
			}
		},
		modificationOptions(hand) {
			const selfIndex = hand.findIndex(card => card.id === this.id)
			// Block villain effects from happening before Squirrel Girl blanks their text.
			// Only allow Selene to go before Squirrel Girl since it's up to the player which one blanks the other
			if (hand.some((card, index) => index < selfIndex && card.type === CARD_TYPE.VILLAIN && card.id !== 76)) {
				throw new Error('Trying to blank the text of a used card')
			}
			return 1
		},
		score() {
			return this.power
		}
	},
	//#endregion Promo
	//#endregion Marvel Remix

	//#region Marvel Remix - The Cosmos
	//#region Ally
	81: {
		// Mantis
		id: 81,
		type: CARD_TYPE.ALLY,
		power: 2,
		tags: [TAG.GUARDIAN, TAG.INTEL],
		score(hand) {
			const highestBonus = Math.max(
				...hand
					.filter(card => card.type === CARD_TYPE.ALLY || card.type === CARD_TYPE.HERO)
					.map(card => card.bonusValue || 0)
			)
			return this.power + highestBonus
		}
	},
	82: {
		// Nick Fury, Jr.
		id: 82,
		type: CARD_TYPE.ALLY,
		power: 3,
		tags: [TAG.TECH, TAG.INTEL, TAG.RANGE],
		bonusValue: 3,
		score(hand) {
			const heroCount = count(hand, card => card.type === CARD_TYPE.HERO)
			return this.power + heroCount * 3
		}
	},
	83: {
		// Eddie Brock
		id: 83,
		type: CARD_TYPE.ALLY,
		power: 3,
		tags: [TAG.INTEL],
		bonusValue: 12,
		score(hand) {
			const hasSymbiote = hand.some(card => card.modifiedTags.includes(TAG.SYMBIOTE))
			return this.power + (hasSymbiote ? 12 : 0)
		}
	},
	84: {
		// Intergalactic Kingdom of Wakanda
		id: 84,
		type: CARD_TYPE.ALLY,
		power: 5,
		tags: [TAG.WAKANDA, TAG.SPACE, TAG.TECH],
		score() {
			return this.power
		}
	},
	85: {
		// Cosmo
		id: 85,
		type: CARD_TYPE.ALLY,
		power: 5,
		tags: [TAG.GUARDIAN, TAG.INTEL, TAG.RANGE],
		bonusValue: 5,
		score(hand) {
			const hasOtherGuardian = hand.some(card => card.id !== this.id && card.modifiedTags.includes(TAG.GUARDIAN))
			return this.power + (hasOtherGuardian ? 5 : 0)
		}
	},
	86: {
		// Timekeepers
		id: 86,
		type: CARD_TYPE.ALLY,
		power: 7,
		tags: [TAG.TIME, TAG.INTEL, TAG.RANGE],
		bonusValue: 7,
		score(hand) {
			const timeTagCount = sumBy(hand, card =>
				card.id !== this.id ? count(card.modifiedTags, tag => tag === TAG.TIME) : 0
			)
			return this.power + timeTagCount * 7
		}
	},
	87: {
		// Nova Corps
		id: 87,
		type: CARD_TYPE.ALLY,
		power: 7,
		tags: [TAG.SPACE, TAG.TECH, TAG.FLIGHT],
		transform(hand, self) {
			self.isBlanked = !hand.some(card => card.id !== 87 && card.modifiedTags.includes(TAG.SPACE))
		},
		score() {
			return this.power
		}
	},
	88: {
		// In-Betweener
		id: 88,
		type: CARD_TYPE.ALLY,
		power: 7,
		tags: [TAG.COSMIC, TAG.SPACE],
		negativeValue: -15,
		score(hand) {
			const higherCount = count(hand, card => card.power > this.power)
			const lowerCount = count(hand, card => card.power < this.power)
			return this.power + (higherCount >= 3 && lowerCount >= 3 ? 0 : -15)
		}
	},
	89: {
		// Uatu, The Watcher
		id: 89,
		type: CARD_TYPE.ALLY,
		power: 10,
		tags: [TAG.COSMIC, TAG.SPACE, TAG.INTEL],
		score() {
			return this.power
		}
	},
	//#endregion Ally
	//#region Condition
	90: {
		// Unexpected Strength
		id: 90,
		type: CARD_TYPE.CONDITION,
		power: 19,
		tags: [],
		transform(hand, self) {
			const allyCount = count(hand, card => card.type === CARD_TYPE.ALLY)
			const heroCount = count(hand, card => card.type === CARD_TYPE.HERO)
			self.isBlanked = allyCount <= heroCount
		},
		score() {
			return this.power
		}
	},
	91: {
		// Cosmically Attuned
		id: 91,
		type: CARD_TYPE.CONDITION,
		power: 15,
		tags: [TAG.TIME],
		transform(hand, self) {
			const hasIntel = hand.some(card => card.modifiedTags.includes(TAG.INTEL))
			const hasCosmic = hand.some(card => card.modifiedTags.includes(TAG.COSMIC))
			self.isBlanked = !(hasIntel && hasCosmic)
		},
		score() {
			return this.power
		}
	},
	92: {
		// Rediscovered Artifact
		id: 92,
		type: CARD_TYPE.CONDITION,
		power: 16,
		tags: [],
		transform(hand, self) {
			const hasIntel = hand.some(card => card.modifiedTags.includes(TAG.INTEL))
			const hasEquipment = hand.some(card => card.type === CARD_TYPE.EQUIPMENT)
			self.isBlanked = !(hasIntel && hasEquipment)
		},
		score() {
			return this.power
		}
	},
	93: {
		// Crimelord
		id: 93,
		type: CARD_TYPE.CONDITION,
		power: 17,
		tags: [],
		transform(hand, self) {
			const hasUrban = hand.some(card => card.modifiedTags.includes(TAG.URBAN))
			const hasBoss = hand.some(card => card.modifiedTags.includes(TAG.BOSS))
			self.isBlanked = !(hasUrban && hasBoss)
		},
		score() {
			return this.power
		}
	},
	94: {
		// Exiled
		id: 94,
		type: CARD_TYPE.CONDITION,
		power: 18,
		tags: [],
		transform(hand, self) {
			const spaceCount = sumBy(hand, card => count(card.modifiedTags, tag => tag === TAG.SPACE))
			self.isBlanked = spaceCount < 3
		},
		score() {
			return this.power
		}
	},
	//#endregion Condition
	//#region Equipment
	95: {
		// Infinity Gauntlet
		id: 95,
		type: CARD_TYPE.EQUIPMENT,
		power: 0,
		tags: [],
		score(hand) {
			const infinityStoneCount = count(hand, card => card.modifiedTags.includes(TAG.INFINITY_STONE))
			return this.power + infinityStoneCount * 13
		}
	},
	96: {
		// All-Black the Necrosword
		id: 96,
		type: CARD_TYPE.EQUIPMENT,
		power: 0,
		tags: [TAG.SYMBIOTE, TAG.STRENGTH],
		score(hand) {
			const matchingTagCount = sumBy(hand, card =>
				count(card.modifiedTags, tag => tag === TAG.COSMIC || tag === TAG.ASGARD)
			)
			return this.power + matchingTagCount * 5
		}
	},
	97: {
		// The Milano
		id: 97,
		type: CARD_TYPE.EQUIPMENT,
		power: 0,
		tags: [TAG.SPACE, TAG.FLIGHT, TAG.RANGE],
		score(hand) {
			const matchingTagCount = sumBy(hand, card =>
				count(card.modifiedTags, tag => tag === TAG.GUARDIAN || tag === TAG.TECH || tag === TAG.AGILITY)
			)
			return this.power + matchingTagCount * 3
		}
	},
	98: {
		// Forever Crystal
		id: 98,
		type: CARD_TYPE.EQUIPMENT,
		power: 6,
		tags: [TAG.TIME],
		score(hand) {
			const kreeCount = sumBy(hand, card => count(card.modifiedTags, tag => tag === TAG.KREE))
			return this.power + kreeCount * 6
		}
	},
	99: {
		// Quantum Bands
		id: 99,
		type: CARD_TYPE.EQUIPMENT,
		power: 8,
		tags: [TAG.SPACE, TAG.STRENGTH, TAG.FLIGHT, TAG.RANGE],
		transform(hand, self) {
			self.isBlanked = !hand.some(card => card.modifiedTags.includes(TAG.TECH))
		},
		score() {
			return this.power
		}
	},
	100: {
		// Stormbreaker
		id: 100,
		type: CARD_TYPE.EQUIPMENT,
		power: 9,
		tags: [TAG.ASGARD, TAG.STRENGTH, TAG.FLIGHT],
		transform(hand, self) {
			// The card doesn't specify 'other', but it seems clearly intended to need another card
			self.isBlanked = !hand.some(
				card =>
					card.id !== this.id &&
					(card.modifiedTags.includes(TAG.STRENGTH) || card.modifiedTags.includes(TAG.WORTHY))
			)
		},
		score() {
			return this.power
		}
	},
	101: {
		// Power Stone
		id: 101,
		type: CARD_TYPE.EQUIPMENT,
		power: -9,
		tags: [TAG.COSMIC, TAG.INFINITY_STONE],
		negativeValue: -9,
		score(hand) {
			const hasAdamWarlock = hand.some(card => card.id === 148 && card.isTransformed)
			return hasAdamWarlock ? 0 : this.power
		}
	},
	102: {
		// Reality Stone
		id: 102,
		type: CARD_TYPE.EQUIPMENT,
		power: -8,
		tags: [TAG.COSMIC, TAG.INFINITY_STONE],
		negativeValue: -8,
		score(hand) {
			const hasAdamWarlock = hand.some(card => card.id === 148 && card.isTransformed)
			return hasAdamWarlock ? 0 : this.power
		}
	},
	103: {
		// Space Stone
		id: 103,
		type: CARD_TYPE.EQUIPMENT,
		power: -7,
		tags: [TAG.COSMIC, TAG.SPACE, TAG.INFINITY_STONE],
		negativeValue: -7,
		score(hand) {
			const hasAdamWarlock = hand.some(card => card.id === 148 && card.isTransformed)
			return hasAdamWarlock ? 0 : this.power
		}
	},
	104: {
		// Mind Stone
		id: 104,
		type: CARD_TYPE.EQUIPMENT,
		power: -5,
		tags: [TAG.COSMIC, TAG.INFINITY_STONE],
		negativeValue: -5,
		score(hand) {
			const hasAdamWarlock = hand.some(card => card.id === 148 && card.isTransformed)
			return hasAdamWarlock ? 0 : this.power
		}
	},
	105: {
		// Soul Stone
		id: 105,
		type: CARD_TYPE.EQUIPMENT,
		power: -4,
		tags: [TAG.COSMIC, TAG.INFINITY_STONE],
		negativeValue: -4,
		score(hand) {
			const hasAdamWarlock = hand.some(card => card.id === 148 && card.isTransformed)
			return hasAdamWarlock ? 0 : this.power
		}
	},
	106: {
		// Time Stone
		id: 106,
		type: CARD_TYPE.EQUIPMENT,
		power: -6,
		tags: [TAG.COSMIC, TAG.TIME, TAG.INFINITY_STONE],
		negativeValue: -6,
		score(hand) {
			const hasAdamWarlock = hand.some(card => card.id === 148 && card.isTransformed)
			return hasAdamWarlock ? 0 : this.power
		}
	},
	//#endregion Equipment
	//#region Hero
	107: {
		// Carol Danvers
		id: 107,
		type: CARD_TYPE.HERO,
		power: 2,
		tags: [TAG.FLIGHT],
		transformedTags: [TAG.SPACE, TAG.KREE, TAG.STRENGTH, TAG.FLIGHT, TAG.RANGE],
		transform(hand, self) {
			const isTransformed = !!self.isTransformed
			const shouldTransform = hand.some(card =>
				card.modifiedTags.some(tag => tag === TAG.COSMIC || tag === TAG.KREE)
			)

			if (isTransformed === shouldTransform) return

			if (shouldTransform) {
				self.isTransformed = true
				self.modifiedPower = 8
				self.modifiedTags.push(TAG.SPACE)
				self.modifiedTags.push(TAG.KREE)
				self.modifiedTags.push(TAG.STRENGTH)
				self.modifiedTags.push(TAG.RANGE)
			} else {
				self.isTransformed = false
				self.modifiedPower = 2
				removeTag(self, TAG.SPACE)
				removeTag(self, TAG.KREE)
				removeTag(self, TAG.STRENGTH)
				removeTag(self, TAG.RANGE)
			}
		},
		score() {
			return this.power
		}
	},
	108: {
		// Silver Surfer
		id: 108,
		type: CARD_TYPE.HERO,
		power: 7,
		tags: [TAG.FLIGHT, TAG.RANGE, TAG.SPACE],
		score() {
			return this.power
		}
	},
	109: {
		// Doctor Strange
		id: 109,
		type: CARD_TYPE.HERO,
		power: 1,
		tags: [TAG.MAGIC, TAG.FLIGHT],
		score() {
			return this.power
		}
	},
	110: {
		// Mr. Fantastic
		id: 110,
		type: CARD_TYPE.HERO,
		power: 4,
		tags: [TAG.FANTASTIC_FOUR, TAG.TECH, TAG.AGILITY],
		bonusValue: 4,
		score(hand) {
			const fantastic4Count = sumBy(hand, card =>
				card.id !== this.id ? count(card.modifiedTags, tag => tag === TAG.FANTASTIC_FOUR) : 0
			)
			return this.power + fantastic4Count * 4
		}
	},
	111: {
		// Ms. Marvel
		id: 111,
		type: CARD_TYPE.HERO,
		power: 5,
		tags: [TAG.KREE, TAG.STRENGTH, TAG.AGILITY],
		score() {
			return this.power
		}
	},
	112: {
		// Human Torch
		id: 112,
		type: CARD_TYPE.HERO,
		power: 5,
		tags: [TAG.FANTASTIC_FOUR, TAG.AGILITY, TAG.FLIGHT, TAG.RANGE],
		score() {
			return this.power
		}
	},
	113: {
		// Groot
		id: 113,
		type: CARD_TYPE.HERO,
		power: 4,
		tags: [TAG.GUARDIAN, TAG.STRENGTH, TAG.STRENGTH],
		bonusValue: 3,
		score(hand) {
			const containsRocketRacoon = hand.some(card => card.id === 120)
			return this.power + (containsRocketRacoon ? 3 : 0)
		}
	},
	114: {
		// Nova
		id: 114,
		type: CARD_TYPE.HERO,
		power: 4,
		tags: [TAG.SPACE, TAG.FLIGHT, TAG.RANGE],
		score() {
			return this.power
		}
	},
	115: {
		// The Thing
		id: 115,
		type: CARD_TYPE.HERO,
		power: 4,
		tags: [TAG.FANTASTIC_FOUR, TAG.STRENGTH, TAG.STRENGTH],
		score() {
			return this.power
		}
	},
	116: {
		// She-Hulk, Attorney
		id: 116,
		type: CARD_TYPE.HERO,
		power: 4,
		tags: [TAG.GAMMA, TAG.INTEL, TAG.STRENGTH, TAG.STRENGTH],
		score() {
			return this.power
		}
	},
	117: {
		// Kitty Pryde
		id: 117,
		type: CARD_TYPE.HERO,
		power: 4,
		tags: [TAG.GUARDIAN, TAG.MUTANT, TAG.TECH],
		bonusValue: 4,
		score(hand) {
			const hasLocation = hand.some(card => card.type === CARD_TYPE.LOCATION)
			return this.power + (hasLocation ? 4 : 0)
		}
	},
	118: {
		// Star-Lord
		id: 118,
		type: CARD_TYPE.HERO,
		power: 5,
		tags: [TAG.GUARDIAN, TAG.RANGE],
		bonusValue: 4,
		score(hand) {
			const guardianCount = sumBy(hand, card =>
				card.id !== this.id ? count(card.modifiedTags, tag => tag === TAG.GUARDIAN) : 0
			)
			return this.power + guardianCount * 4
		}
	},
	119: {
		// Drax
		id: 119,
		type: CARD_TYPE.HERO,
		power: 6,
		tags: [TAG.GUARDIAN, TAG.STRENGTH, TAG.AGILITY],
		score() {
			return this.power
		}
	},
	120: {
		// Rocket Racoon
		id: 120,
		type: CARD_TYPE.HERO,
		power: 6,
		tags: [TAG.GUARDIAN, TAG.TECH, TAG.RANGE],
		bonusValue: 2,
		score(hand) {
			const containsGroot = hand.some(card => card.id === 113)
			return this.power + (containsGroot ? 2 : 0)
		}
	},
	121: {
		// Spectrum
		id: 121,
		type: CARD_TYPE.HERO,
		power: 7,
		tags: [TAG.AGILITY, TAG.FLIGHT, TAG.RANGE],
		score() {
			return this.power
		}
	},
	122: {
		// Invisible Woman
		id: 122,
		type: CARD_TYPE.HERO,
		power: 6,
		tags: [TAG.FANTASTIC_FOUR, TAG.INTEL, TAG.AGILITY],
		bonusValue: 3,
		score(hand) {
			const zeroPowerCardCount = count(hand, card => card.power === 0)
			return this.power + zeroPowerCardCount * 3
		}
	},
	123: {
		// Moondragon
		id: 123,
		type: CARD_TYPE.HERO,
		power: 0,
		tags: [TAG.GUARDIAN, TAG.INTEL, TAG.FLIGHT, TAG.RANGE],
		bonusValue: 3,
		score() {
			// TODO
			return this.power
		}
	},
	124: {
		// Gamora
		id: 124,
		type: CARD_TYPE.HERO,
		power: 6,
		tags: [TAG.GUARDIAN, TAG.INTEL, TAG.AGILITY],
		score() {
			return this.power
		}
	},
	125: {
		// Beta Ray Bill
		id: 125,
		type: CARD_TYPE.HERO,
		power: 8,
		tags: [TAG.ASGARD, TAG.WORTHY, TAG.STRENGTH],
		score() {
			return this.power
		}
	},
	//#endregion Hero
	//#region Location
	126: {
		// Exploding Ship
		id: 126,
		type: CARD_TYPE.LOCATION,
		power: 0,
		tags: [TAG.SPACE],
		score(hand) {
			const matchingTagCount = sumBy(hand, card =>
				count(card.modifiedTags, tag => tag === TAG.FLIGHT || tag === TAG.TECH)
			)
			return this.power + matchingTagCount * 4
		}
	},
	127: {
		// Asteroid Field
		id: 127,
		type: CARD_TYPE.LOCATION,
		power: 0,
		tags: [TAG.SPACE],
		score(hand) {
			// [rangeCount, agilityCount]
			const matchingTagCounts = hand.reduce(
				(counts, card) => {
					counts[0] += count(card.modifiedTags, tag => tag === TAG.RANGE)
					counts[1] += count(card.modifiedTags, tag => tag === TAG.AGILITY)
					return counts
				},
				[0, 0]
			)

			return this.power + Math.min(...matchingTagCounts) * 8
		}
	},
	128: {
		// Sakaar - Planet Hulk
		id: 128,
		type: CARD_TYPE.LOCATION,
		power: 0,
		tags: [TAG.URBAN, TAG.GAMMA],
		score() {
			// TODO
			return this.power
		}
	},
	129: {
		// Baxter Building
		id: 129,
		type: CARD_TYPE.LOCATION,
		power: 0,
		tags: [TAG.URBAN, TAG.TECH, TAG.INTEL],
		score(hand) {
			const fantastic4Count = sumBy(hand, card => count(card.modifiedTags, tag => tag === TAG.FANTASTIC_FOUR))
			return this.power + fantastic4Count * 8
		}
	},
	130: {
		// Knowhere
		id: 130,
		type: CARD_TYPE.LOCATION,
		power: 4,
		tags: [TAG.SPACE, TAG.URBAN],
		score(hand) {
			const intelCount = sumBy(hand, card => count(card.modifiedTags, tag => tag === TAG.INTEL))
			return this.power + intelCount * 4
		}
	},
	131: {
		// Research Lab
		id: 131,
		type: CARD_TYPE.LOCATION,
		power: 4,
		tags: [TAG.MAGIC],
		transform(hand, self) {
			self.isBlanked = !hand.some(card => card.modifiedTags.some(tag => tag === TAG.TECH))
		},
		score() {
			return this.power
		}
	},
	132: {
		// Latveria
		id: 132,
		type: CARD_TYPE.LOCATION,
		power: 4,
		tags: [TAG.URBAN, TAG.TECH],
		score(hand) {
			const hasBonusCard = hand.some(card => card.modifiedTags.includes(TAG.FANTASTIC_FOUR) || card.id === 151)
			return this.power + (hasBonusCard ? 12 : 0)
		}
	},
	133: {
		// The Peak (VII)
		id: 133,
		type: CARD_TYPE.LOCATION,
		power: 5,
		tags: [TAG.SPACE, TAG.TECH, TAG.INTEL],
		score() {
			return this.power
		}
	},
	134: {
		// Citadel at the End of Time
		id: 134,
		type: CARD_TYPE.LOCATION,
		power: 9,
		tags: [TAG.TIME, TAG.INTEL],
		score() {
			return this.power
		}
	},
	135: {
		// Anti-Alien Riots
		id: 135,
		type: CARD_TYPE.LOCATION,
		power: 14,
		tags: [TAG.URBAN],
		transform(hand, self) {
			const hasSpace = hand.some(card => card.modifiedTags.includes(TAG.SPACE))
			const hasOtherUrban = hand.some(card => card.id !== 135 && card.modifiedTags.includes(TAG.URBAN))
			self.isBlanked = !(hasSpace && hasOtherUrban)
		},
		score() {
			return this.power
		}
	},
	136: {
		// Prison Break
		id: 136,
		type: CARD_TYPE.LOCATION,
		power: 18,
		tags: [],
		transform(hand, self) {
			const requiredTags = [TAG.INTEL, TAG.AGILITY, TAG.FLIGHT]
			self.isBlanked = !requiredTags.every(tag => hand.some(card => card.modifiedTags.includes(tag)))
		},
		score() {
			return this.power
		}
	},
	137: {
		// Ego
		id: 137,
		type: CARD_TYPE.LOCATION,
		power: -6,
		tags: [TAG.COSMIC, TAG.SPACE],
		score() {
			return this.power
		}
	},
	138: {
		// Battleworld
		id: 138,
		type: CARD_TYPE.LOCATION,
		power: 0,
		tags: [TAG.COSMIC, TAG.SPACE],
		negativeValue: -20,
		score(hand) {
			const heroCount = count(hand, card => card.type === CARD_TYPE.HERO)
			const villainCount = count(hand, card => card.type === CARD_TYPE.VILLAIN)
			const pairCount = Math.min(heroCount, villainCount)
			const unmatchedCount = Math.abs(heroCount - villainCount)
			return this.power + pairCount * 10 - unmatchedCount * 20
		}
	},
	139: {
		// Interdimensional Rift
		id: 139,
		type: CARD_TYPE.LOCATION,
		power: 9,
		tags: [TAG.COSMIC],
		score() {
			return this.power
		}
	},
	//#endregion Location
	//#region Maneuver
	140: {
		// Dodge Blasters
		id: 140,
		type: CARD_TYPE.MANEUVER,
		power: 0,
		tags: [],
		score(hand) {
			// [flightCount, agilityCount]
			const matchingTagCounts = hand.reduce(
				(counts, card) => {
					counts[0] += count(card.modifiedTags, tag => tag === TAG.FLIGHT)
					counts[1] += count(card.modifiedTags, tag => tag === TAG.AGILITY)
					return counts
				},
				[0, 0]
			)

			return this.power + Math.min(...matchingTagCounts) * 10
		}
	},
	141: {
		// Into Orbit
		id: 141,
		type: CARD_TYPE.MANEUVER,
		power: 0,
		tags: [],
		score(hand) {
			// [spaceCount, flightCount]
			const matchingTagCounts = hand.reduce(
				(counts, card) => {
					counts[0] += count(card.modifiedTags, tag => tag === TAG.SPACE)
					counts[1] += count(card.modifiedTags, tag => tag === TAG.FLIGHT)
					return counts
				},
				[0, 0]
			)

			return this.power + Math.min(...matchingTagCounts) * 9
		}
	},
	142: {
		// Hurl Asteroids
		id: 142,
		type: CARD_TYPE.MANEUVER,
		power: 0,
		tags: [],
		score(hand) {
			// [strengthCount, spaceCount]
			const matchingTagCounts = hand.reduce(
				(counts, card) => {
					counts[0] += count(card.modifiedTags, tag => tag === TAG.STRENGTH)
					counts[1] += count(card.modifiedTags, tag => tag === TAG.SPACE)
					return counts
				},
				[0, 0]
			)

			return this.power + Math.min(...matchingTagCounts) * 9
		}
	},
	143: {
		// Investigation
		id: 143,
		type: CARD_TYPE.MANEUVER,
		power: 12,
		tags: [],
		transform(hand, self) {
			const hasBoss = hand.some(card => card.modifiedTags.includes(TAG.BOSS))
			const hasIntel = hand.some(card => card.modifiedTags.includes(TAG.INTEL))
			self.isBlanked = !(hasBoss && hasIntel)
		},
		score() {
			return this.power
		}
	},
	144: {
		// Buried in Soldiers
		id: 144,
		type: CARD_TYPE.MANEUVER,
		power: 12,
		tags: [],
		transform(hand, self) {
			const hasBoss = hand.some(card => card.modifiedTags.includes(TAG.BOSS))
			const hasStrength = hand.some(card => card.modifiedTags.includes(TAG.STRENGTH))
			self.isBlanked = !(hasBoss && hasStrength)
		},
		score() {
			return this.power
		}
	},
	145: {
		// Track Minion
		id: 145,
		type: CARD_TYPE.MANEUVER,
		power: 13,
		tags: [],
		transform(hand, self) {
			const hasBoss = hand.some(card => card.modifiedTags.includes(TAG.BOSS))
			const hasTech = hand.some(card => card.modifiedTags.includes(TAG.TECH))
			self.isBlanked = !(hasBoss && hasTech)
		},
		score() {
			return this.power
		}
	},
	146: {
		// Travel Through Time
		id: 146,
		type: CARD_TYPE.MANEUVER,
		power: -4,
		tags: [TAG.COSMIC, TAG.TIME],
		negativeValue: -4,
		score() {
			return this.power
		}
	},
	//#endregion Maneuver
	//#region Villain
	147: {
		// Galactus
		id: 147,
		type: CARD_TYPE.VILLAIN,
		power: 0,
		tags: [TAG.COSMIC, TAG.SPACE],
		score() {
			// TODO
			return this.power
		}
	},
	148: {
		// Magus
		id: 148,
		type: CARD_TYPE.VILLAIN,
		power: 7,
		tags: [TAG.TIME],
		transformedTags: [TAG.SPACE, TAG.STRENGTH, TAG.FLIGHT],
		transform(hand, self) {
			const isTransformed = !!self.isTransformed
			const shouldTransform = hand.some(card => card.id !== self.id && card.modifiedTags.includes(TAG.TIME))

			if (isTransformed === shouldTransform) return

			if (shouldTransform) {
				self.isTransformed = true
				self.type = CARD_TYPE.HERO
				self.modifiedPower = 11
				self.modifiedTags.push(TAG.SPACE, TAG.STRENGTH, TAG.FLIGHT)
				removeTag(self, TAG.TIME)
			} else {
				self.isTransformed = false
				self.type = CARD_TYPE.VILLAIN
				self.modifiedPower = 7
				self.modifiedTags.push(TAG.TIME)
				removeTag(self, TAG.SPACE)
				removeTag(self, TAG.STRENGTH)
				removeTag(self, TAG.FLIGHT)
			}
		},
		score() {
			return this.power
		}
	},
	149: {
		// Venom
		id: 149,
		type: CARD_TYPE.VILLAIN,
		power: 8,
		tags: [TAG.SYMBIOTE],
		transformedTags: [TAG.SYMBIOTE, TAG.STRENGTH],
		transform(hand, self) {
			const isTransformed = !!self.isTransformed
			const shouldTransform = hand.some(card => card.type === CARD_TYPE.ALLY)

			if (isTransformed === shouldTransform) return

			if (shouldTransform) {
				self.isTransformed = true
				self.type = CARD_TYPE.HERO
				self.modifiedPower = 13
				self.modifiedTags.push(TAG.STRENGTH)
			} else {
				self.isTransformed = false
				self.type = CARD_TYPE.VILLAIN
				self.modifiedPower = 8
				removeTag(self, TAG.STRENGTH)
			}
		},
		score() {
			return this.power
		}
	},
	150: {
		// Nebula
		id: 150,
		type: CARD_TYPE.VILLAIN,
		power: 9,
		tags: [],
		transformedTags: [TAG.GUARDIAN, TAG.TECH, TAG.STRENGTH],
		transform(hand, self) {
			const isTransformed = !!self.isTransformed
			const hasGuardian = hand.some(card => card.modifiedTags.includes(TAG.GUARDIAN))
			const hasIntel = sumBy(hand, card => count(card.modifiedTags, tag => tag === TAG.INTEL)) > 2
			const shouldTransform = hasGuardian && hasIntel

			if (isTransformed === shouldTransform) return

			if (shouldTransform) {
				self.isTransformed = true
				self.type = CARD_TYPE.HERO
				self.modifiedPower = 14
				self.modifiedTags.push(TAG.GUARDIAN)
				self.modifiedTags.push(TAG.TECH)
				self.modifiedTags.push(TAG.STRENGTH)
			} else {
				self.isTransformed = false
				self.type = CARD_TYPE.VILLAIN
				self.modifiedPower = 9
				removeTag(self, TAG.GUARDIAN)
				removeTag(self, TAG.TECH)
				removeTag(self, TAG.STRENGTH)
			}
		},
		score() {
			return this.power
		}
	},
	151: {
		// Doctor Doom
		id: 151,
		type: CARD_TYPE.VILLAIN,
		power: -20,
		tags: [TAG.BOSS],
		negativeValue: -20,
		score(hand) {
			const requiredTags = [TAG.TECH, TAG.INTEL, TAG.STRENGTH, TAG.RANGE]
			const hasAllTags = requiredTags.every(tag => hand.some(card => card.modifiedTags.includes(tag)))
			return this.power + (hasAllTags ? 45 : 0)
		}
	},
	152: {
		// Thanos
		id: 152,
		type: CARD_TYPE.VILLAIN,
		power: 10,
		tags: [TAG.BOSS],
		score(hand) {
			const infinityStoneCount = sumBy(hand, card => count(card.modifiedTags, tag => tag === TAG.INFINITY_STONE))
			return this.power + infinityStoneCount * 10
		}
	},
	153: {
		// Invading Armada
		id: 153,
		type: CARD_TYPE.VILLAIN,
		power: -10,
		tags: [TAG.SPACE, TAG.BOSS],
		bonusValue: 5,
		negativeValue: -10,
		score(hand) {
			const matchingTagCount = sumBy(hand, card =>
				count(
					card.modifiedTags,
					tag => tag === TAG.FLIGHT || tag === TAG.RANGE || (card.id !== this.id && tag === TAG.SPACE)
				)
			)
			return this.power + matchingTagCount * 5
		}
	},
	154: {
		// Gorr
		id: 154,
		type: CARD_TYPE.VILLAIN,
		power: -7,
		tags: [],
		bonusValue: 7,
		negativeValue: -7,
		score(hand) {
			const matchingTagCount = sumBy(hand, card =>
				count(card.modifiedTags, tag => tag === TAG.COSMIC || tag === TAG.ASGARD)
			)
			return this.power + matchingTagCount * 7
		}
	},
	155: {
		// Supreme Intelligence
		id: 155,
		type: CARD_TYPE.VILLAIN,
		power: -7,
		tags: [TAG.KREE, TAG.BOSS],
		bonusValue: 7,
		negativeValue: -7,
		score(hand) {
			const matchingTagCount = sumBy(hand, card =>
				count(card.modifiedTags, tag => tag === TAG.INTEL || (card.id !== this.id && tag === TAG.KREE))
			)
			return this.power + matchingTagCount * 7
		}
	},
	156: {
		// Emperor N'Jadaka
		id: 156,
		type: CARD_TYPE.VILLAIN,
		power: -6,
		tags: [TAG.SYMBIOTE, TAG.WAKANDA, TAG.BOSS],
		bonusValue: 6,
		negativeValue: -6,
		score(hand) {
			const spaceCount = sumBy(hand, card => count(card.modifiedTags, tag => tag === TAG.SPACE))
			return this.power + spaceCount * 6
		}
	},
	157: {
		// Yon-Rogg
		id: 157,
		type: CARD_TYPE.VILLAIN,
		power: -5,
		tags: [TAG.KREE],
		bonusValue: 5,
		negativeValue: -5,
		score(hand) {
			const matchingTagCount = sumBy(hand, card =>
				count(card.modifiedTags, tag => tag === TAG.STRENGTH || tag === TAG.AGILITY)
			)
			return this.power + matchingTagCount * 5
		}
	},
	158: {
		// Ronan the Accuser
		id: 158,
		type: CARD_TYPE.VILLAIN,
		power: -4,
		tags: [TAG.KREE, TAG.BOSS],
		bonusValue: 4,
		negativeValue: -4,
		score(hand) {
			const matchingTagCount = sumBy(hand, card =>
				count(card.modifiedTags, tag => tag === TAG.STRENGTH || tag === TAG.RANGE)
			)
			return this.power + matchingTagCount * 4
		}
	},
	159: {
		// Knull
		id: 159,
		type: CARD_TYPE.VILLAIN,
		power: 0,
		tags: [TAG.BOSS],
		bonusValue: 11,
		score(hand) {
			const symbioteCount = sumBy(hand, card => count(card.modifiedTags, tag => tag === TAG.SYMBIOTE))
			return this.power + symbioteCount * 11
		}
	},
	160: {
		// Annihilus
		id: 160,
		type: CARD_TYPE.VILLAIN,
		power: 0,
		tags: [],
		score(hand) {
			// TODO - does this count Galactus?
			const largestValue = Math.abs(Math.min(...hand.map(card => card.negativeValue || 0)))
			return this.power + largestValue
		}
	},
	161: {
		// Carnage
		id: 161,
		type: CARD_TYPE.VILLAIN,
		power: 10,
		tags: [TAG.SYMBIOTE],
		score(hand) {
			const highestBonus = Math.max(
				...hand.filter(card => card.type === CARD_TYPE.VILLAIN).map(card => card.bonusValue || 0)
			)
			return this.power + highestBonus
		}
	},
	162: {
		// Immortus
		id: 162,
		type: CARD_TYPE.VILLAIN,
		power: 14,
		tags: [TAG.TIME],
		negativeValue: -20,
		score(hand) {
			const hasTime = hand.some(card => card.id !== this.id && card.modifiedTags.includes(TAG.TIME))
			return this.power - (hasTime ? 0 : 20)
		}
	},
	163: {
		// The Matriarch
		id: 163,
		type: CARD_TYPE.VILLAIN,
		power: 20,
		tags: [TAG.BOSS],
		negativeValue: -20,
		score(hand) {
			const tagTypes = new Set<TAG>()
			for (const card of hand) {
				for (const tag of card.modifiedTags) {
					tagTypes.add(tag)
				}
			}
			return this.power - (tagTypes.size > 6 ? 20 : 0)
		}
	},
	164: {
		// The High Evolutionary
		id: 164,
		type: CARD_TYPE.VILLAIN,
		power: 16,
		tags: [TAG.BOSS],
		negativeValue: -20,
		score() {
			// TODO
			return this.power
		}
	},
	165: {
		// Toxin
		id: 165,
		type: CARD_TYPE.VILLAIN,
		power: 6,
		tags: [TAG.SYMBIOTE],
		score() {
			return this.power
		}
	},
	166: {
		// Champion
		id: 166,
		type: CARD_TYPE.VILLAIN,
		power: 8,
		tags: [TAG.COSMIC],
		score() {
			return this.power
		}
	},
	167: {
		// Collector
		id: 167,
		type: CARD_TYPE.VILLAIN,
		power: 0,
		tags: [TAG.COSMIC],
		score(hand) {
			const cardTypes = new Array<number>(Object.keys(CARD_TYPE).length).fill(0)
			for (const card of hand) {
				cardTypes[card.type]++
			}
			const setSize = Math.min(Math.max(...cardTypes), 7)
			const typeScores = [0, 0, 3, 5, 10, 20, 35]
			return this.power + typeScores[setSize - 1]
		}
	},
	168: {
		// Grandmaster
		id: 168,
		type: CARD_TYPE.VILLAIN,
		power: 9,
		tags: [TAG.COSMIC],
		score() {
			return this.power
		}
	}
	//#endregion Villain
	//#endregion Marvel Remix - The Cosmos
}
