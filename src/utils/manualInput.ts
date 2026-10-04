/** A manually entered game value, with an optional second value for inputs that need one (e.g. transform state). */
export interface ManualInput {
	value: number
	secondaryValue?: number
}

/** Manually entered game values, keyed by the card they belong to. A missing key means nobody has answered yet. */
export type ManualInputs = Record<number, ManualInput>

const ENTRY_SEPARATOR = '.'
const VALUE_SEPARATOR = '-'

const isValidValue = (value: number) => Number.isInteger(value) && value >= 0

/**
 * Read manual inputs from their query parameter.
 *
 * @param param Raw query parameter, in the form `123-4.128-2`, with an optional secondary value as in `104-29-1`
 */
export const parseManualInputs = (param: string | null): ManualInputs => {
	if (!param) return {}

	return param.split(ENTRY_SEPARATOR).reduce<ManualInputs>((inputs, entry) => {
		const parts = entry.split(VALUE_SEPARATOR)
		if (parts.length < 2 || parts.length > 3 || parts.some(part => !part)) return inputs

		const [cardId, value, secondaryValue] = parts.map(Number)
		if (!Number.isInteger(cardId) || cardId <= 0 || !isValidValue(value)) return inputs
		if (parts.length === 3 && !isValidValue(secondaryValue)) return inputs

		inputs[cardId] = parts.length === 3 ? { value, secondaryValue } : { value }
		return inputs
	}, {})
}

export const serializeManualInputs = (inputs: ManualInputs): string =>
	Object.entries(inputs)
		.map(([cardId, { value, secondaryValue }]) =>
			[cardId, value, secondaryValue].filter(part => part !== undefined).join(VALUE_SEPARATOR)
		)
		.join(ENTRY_SEPARATOR)

/** Clear the value entered for one card, putting it back to unanswered. */
export const clearManualInput = (inputs: ManualInputs, cardId: number): ManualInputs =>
	Object.entries(inputs).reduce<ManualInputs>((remaining, [id, value]) => {
		if (Number(id) !== cardId) {
			remaining[Number(id)] = value
		}
		return remaining
	}, {})
