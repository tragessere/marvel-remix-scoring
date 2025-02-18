export const count = <T>(arr: T[], predicate: (val: T, index: number) => boolean) => {
	let count = 0
	for (let i = 0; i < arr.length; i++) {
		if (predicate(arr[i], i)) {
			count++
		}
	}
	return count
}

export const single = <T>(arr: T[], predicate: (val: T) => boolean) => {
	const matches = arr.filter(predicate)
	if (matches.length > 1) {
		throw new Error('More than one element found')
	} else if (matches.length === 0) {
		throw new Error('No element found')
	}
	return matches[0]
}
