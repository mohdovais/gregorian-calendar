import { classname } from "./classname";

test("classname", () => {
	expect(classname([null])).toBeUndefined();
	expect(classname([undefined])).toBeUndefined();
	expect(classname([false])).toBeUndefined();
	expect(classname([null, undefined, false])).toBeUndefined();
	expect(classname([true])).toBe("true");
	expect(classname(["a", "b", "c"])).toBe("a b c");

	expect(classname(null)).toBeUndefined();
	expect(classname(undefined)).toBeUndefined();
	expect(classname(false)).toBeUndefined();
	expect(classname(null, undefined, false)).toBeUndefined();
	expect(classname(true)).toBe("true");
	expect(classname("a", "b", "c")).toBe("a b c");

	expect(classname("a", ["b", false, "c"])).toBe("a b c");
});
