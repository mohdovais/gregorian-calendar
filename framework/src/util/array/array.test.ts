import { ensureArray } from "./index";

test("ensureArray", () => {
	expect(ensureArray(null)).toEqual([]);
	expect(ensureArray(undefined)).toEqual([]);
	expect(ensureArray(1)).toEqual([1]);
	expect(ensureArray("a")).toEqual(["a"]);

	const arr = [1, 2, 3];
	expect(ensureArray(arr)).toBe(arr);
});
