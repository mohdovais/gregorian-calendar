import { noop } from "./index";

test("noop", () => {
	expect(noop()).toBeUndefined();
});
