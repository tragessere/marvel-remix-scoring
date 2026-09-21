import { parseManualInputs, serializeManualInputs } from './manualInput.ts'

describe('parseManualInputs', () => {
	it('reads entries from the query parameter', () => {
		expect(parseManualInputs('123-4.128-2')).toEqual({ 123: 4, 128: 2 })
	})
	it('reads a single entry', () => {
		expect(parseManualInputs('164-1')).toEqual({ 164: 1 })
	})
	it('keeps a zero apart from a missing entry', () => {
		expect(parseManualInputs('128-0')).toEqual({ 128: 0 })
		expect(parseManualInputs('')).toEqual({})
		expect(parseManualInputs(null)).toEqual({})
	})
	it('drops malformed entries without dropping the rest', () => {
		// The separators make negative and fractional values unrepresentable, so they arrive as extra parts
		// Missing value, missing id, extra separator, non-numeric, negative
		expect(parseManualInputs('123-.  -4.128-2-1.abc-def.147--1.128-2')).toEqual({ 128: 2 })
	})
})

describe('serializeManualInputs', () => {
	it('round-trips through the query parameter', () => {
		const inputs = { 123: 4, 128: 0, 164: 1 }
		expect(parseManualInputs(serializeManualInputs(inputs))).toEqual(inputs)
	})
	it('returns an empty string when nothing has been entered', () => {
		expect(serializeManualInputs({})).toBe('')
	})
})
