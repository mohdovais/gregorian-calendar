import { copy, ensureNotNullOrUndefined, hasKey, typeOf } from "./object";

test("copy", () => {
	const a = { A: 1, B: 3 };
	const b = { B: 2 };
	const c = copy(a, b);

	expect(c).not.toBe(a);
	expect(c).not.toBe(b);
	expect(c).toEqual({ A: 1, B: 2 });
});

test("ensureNotNullOrUndefined", () => {
	expect(ensureNotNullOrUndefined(null, "a")).toBe("a");
	expect(ensureNotNullOrUndefined("a", "b")).toBe("a");
});

test("hasKey", () => {
	const o = {
		a: 1,
		b: null,
		c: undefined,
	};
	expect(hasKey(o, "a")).toBe(true);
	expect(hasKey(o, "b")).toBe(true);
	expect(hasKey(o, "c")).toBe(true);
	expect(hasKey(o, "d")).toBe(false);
});

test("typeof", () => {
	expect(typeOf(NaN)).toBe("Number");
	expect(typeOf(0)).toBe("Number");
	expect(typeOf("abc")).toBe("String");
	expect(typeOf(true)).toBe("Boolean");
	expect(typeOf(Symbol.for("test"))).toBe("Symbol");
	expect(typeOf({})).toBe("Object");
	expect(typeOf([])).toBe("Array");
	expect(typeOf(() => {})).toBe("Function");
	expect(typeOf(typeOf)).toBe("Function");
	expect(typeOf(null)).toBe("Null");
	expect(typeOf(undefined)).toBe("Undefined");
});
