import { noop } from "./function";

test("noop", () => {
	expect(noop()).toBeUndefined();
});
