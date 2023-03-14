import { classname } from "./index";

test("classname", () => {
	expect(classname([null])).toBe("");
	expect(classname([undefined])).toBe("");
	expect(classname([false])).toBe("");
	expect(classname([null, undefined, false])).toBe("");
	expect(classname([true])).toBe("true");
	expect(classname(["a", "b", "c"])).toBe("a b c");

	expect(classname(null)).toBe("");
	expect(classname(undefined)).toBe("");
	expect(classname(false)).toBe("");
	expect(classname(null, undefined, false)).toBe("");
	expect(classname(true)).toBe("true");
	expect(classname("a", "b", "c")).toBe("a b c");

	expect(classname("a", ["b", false, "c"])).toBe("a b c");
});
