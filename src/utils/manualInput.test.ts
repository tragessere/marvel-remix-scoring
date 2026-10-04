import { parseManualInputs, serializeManualInputs } from './manualInput.ts'

describe('parseManualInputs', () => {
	it('reads entries from the query parameter', () => {
		expect(parseManualInputs('123-4.128-2')).toEqual({ 123: { value: 4 }, 128: { value: 2 } })
	})
	it('reads a single entry', () => {
		expect(parseManualInputs('164-1')).toEqual({ 164: { value: 1 } })
	})
	it('reads a secondary value', () => {
		expect(parseManualInputs('104-29-1.123-4')).toEqual({
			104: { value: 29, secondaryValue: 1 },
			123: { value: 4 }
		})
	})
	it('keeps a zero apart from a missing entry', () => {
		expect(parseManualInputs('128-0')).toEqual({ 128: { value: 0 } })
		expect(parseManualInputs('104-29-0')).toEqual({ 104: { value: 29, secondaryValue: 0 } })
		expect(parseManualInputs('')).toEqual({})
		expect(parseManualInputs(null)).toEqual({})
	})
	it('drops malformed entries without dropping the rest', () => {
		// The separators make negative and fractional values unrepresentable, so they arrive as extra parts
		// Missing value, missing id, too many parts, non-numeric, negative, missing secondary value
		expect(parseManualInputs('123-.  -4.128-2-1-1.abc-def.147--1.104-29-.128-2')).toEqual({ 128: { value: 2 } })
	})
})

describe('serializeManualInputs', () => {
	it('round-trips through the query parameter', () => {
		const inputs = {
			104: { value: 29, secondaryValue: 0 },
			123: { value: 4 },
			128: { value: 0 },
			164: { value: 1 }
		}
		expect(parseManualInputs(serializeManualInputs(inputs))).toEqual(inputs)
	})
	it('returns an empty string when nothing has been entered', () => {
		expect(serializeManualInputs({})).toBe('')
	})
})
