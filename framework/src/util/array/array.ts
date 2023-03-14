function ensureArray<T>(value: T | T[] | null | undefined): T[] {
	return value == null ? [] : Array.isArray(value) ? value : [value];
}

export { ensureArray };
