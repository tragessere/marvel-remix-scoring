/**
 * Create a two dimensional array of all possible permutations of a given length.
 *
 * @param modifyCardCount
 */
export const generatePermutations = (modifyCardCount: number) => {
	// Create array [0, 1, 2, ..., modifyCardCount - 1]
	const array = Array.from(Array(modifyCardCount).keys())
	const results: number[][] = []

	function permute(subArr: number[], m: number[] = []) {
		if (subArr.length === 0) {
			results.push(m)
		} else {
			for (let i = 0; i < subArr.length; i++) {
				const current = subArr.slice()
				const next = current.splice(i, 1)
				permute(current, m.concat(next))
			}
		}
	}

	permute(array)
	return results
}

/**
 * Create a two dimensional array of all possible combinations of the choose function.
 *
 * @param itemCount Total number of items
 * @param chooseCount Number of items to choose
 */
export const generateCombinations = (itemCount: number, chooseCount: number) => {
	const results: number[][] = []

	function combine(arr: number[], m: number[] = [], i: number = 0) {
		if (m.length === chooseCount) {
			results.push(m)
			return
		}
		if (i < arr.length) {
			combine(arr, m.concat(arr[i]), i + 1)
			combine(arr, m, i + 1)
		}
	}

	combine(Array.from(Array(itemCount).keys()))
	return results
}
