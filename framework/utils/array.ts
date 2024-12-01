const emptyArray = Object.freeze([]);

function ensureArray<T>(value: T | T[] | null | undefined, copy = false): T[] {
	return value == null
		? copy
			? []
			: (emptyArray as unknown as T[])
		: Array.isArray(value)
		? copy
			? value.slice()
			: value
		: [value];
}

function getPreviousItem<T>(
	array: T[],
	item: T,
	cyclic = false,
): T | undefined {
	const length = array.length;
	const currentIndex = array.indexOf(item);
	return length === 0
		? undefined
		: currentIndex > 0
		? array[currentIndex - 1]
		: cyclic && currentIndex === 0
		? array[array.length - 1]
		: array[0];
}

function getNextItem<T>(array: T[], item: T, cyclic = false): T | undefined {
	const currentIndex = array.indexOf(item);
	const length = array.length;
	const lastIndex = length - 1;

	return length === 0
		? undefined
		: length === 1 || (cyclic && currentIndex === lastIndex)
		? array[0]
		: currentIndex < lastIndex
		? array[currentIndex + 1]
		: array[0];
}

export { ensureArray, getPreviousItem, getNextItem };
