import { leftPad } from "./string";

test("leftPad", () => {
	expect(leftPad(0, 2)).toBe("00");
	expect(leftPad(12, 2)).toBe("12");
	expect(leftPad(12, 1)).toBe("12");
	expect(leftPad("a", 1, "b")).toBe("a");
	expect(leftPad("a", 2, "b")).toBe("ba");
});
