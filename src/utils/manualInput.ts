/** Manually entered game values, keyed by the card they belong to. A missing key means nobody has answered yet. */
export type ManualInputs = Record<number, number>

const ENTRY_SEPARATOR = '.'
const VALUE_SEPARATOR = '-'

/**
 * Read manual inputs from their query parameter.
 *
 * @param param Raw query parameter, in the form `123-4.128-2`
 */
export const parseManualInputs = (param: string | null): ManualInputs => {
	if (!param) return {}

	return param.split(ENTRY_SEPARATOR).reduce<ManualInputs>((inputs, entry) => {
		const parts = entry.split(VALUE_SEPARATOR)
		if (parts.length !== 2 || !parts[0] || !parts[1]) return inputs

		const cardId = Number(parts[0])
		const value = Number(parts[1])
		if (!Number.isInteger(cardId) || !Number.isInteger(value) || cardId <= 0 || value < 0) return inputs

		inputs[cardId] = value
		return inputs
	}, {})
}

export const serializeManualInputs = (inputs: ManualInputs): string =>
	Object.entries(inputs)
		.map(([cardId, value]) => `${cardId}${VALUE_SEPARATOR}${value}`)
		.join(ENTRY_SEPARATOR)

/** Clear the value entered for one card, putting it back to unanswered. */
export const clearManualInput = (inputs: ManualInputs, cardId: number): ManualInputs =>
	Object.entries(inputs).reduce<ManualInputs>((remaining, [id, value]) => {
		if (Number(id) !== cardId) {
			remaining[Number(id)] = value
		}
		return remaining
	}, {})
