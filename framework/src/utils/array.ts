const emptyArray = Object.freeze([]);

function ensureArray<T>(value: T | T[] | null | undefined): T[] {
	return value == null
		? (emptyArray as unknown as T[])
		: Array.isArray(value)
		? value
		: [value];
}

export { ensureArray };
