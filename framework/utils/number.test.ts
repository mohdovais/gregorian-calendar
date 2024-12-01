import { bound } from "./number";

test("bound", () => {
	expect(bound(0, 0, 0)).toBe(0);
	expect(bound(10, 0, 5)).toBe(5);
	expect(bound(10, 0, 15)).toBe(10);
	expect(bound(10, 15, 25)).toBe(15);
});
