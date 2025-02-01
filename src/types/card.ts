
export enum CARD_TYPE {
	'VILLAIN',
	'HERO',
	'ALLY',
	'LOCATION',
	'CONDITION',
	'EQUIPMENT',
	'MANEUVER',
}

export enum TAG {
	AGILITY,
	ASGARD,
	BOSS,
	FLIGHT,
	GAMMA,
	INTEL,
	MUTANT,
	RANGE,
	STRENGTH,
	TECH,
	URBAN,
	WAKANDA,
	WORTHY
}

export interface Card {
	id: number
	type: CARD_TYPE,
	name: string,
	power: number,
	tags: TAG[]
	effect?: ((hand: ModifiedCard[], index: number) => void)
	modificationOptions?: ((hand: ModifiedCard[]) => number)
	score: (hand: ModifiedCard[]) => number
	transform?: ((hand: ModifiedCard[]) => void)
}

export interface ModifiedCard extends Card {
	isBlanked: boolean
	isTextBlanked: boolean
	modifiedName: string
	modifiedPower: number
	modifiedTags: TAG[]
	isTransformed?: boolean
}
