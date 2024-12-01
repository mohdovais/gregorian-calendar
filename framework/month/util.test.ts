import { getNormalizedDaysOfMonth } from "./util";

describe("getPaddedMonthDays Monday", () => {
	test("default length", () => {
		const days = getNormalizedDaysOfMonth(2023, 1);
		expect(days.length).toBe(42);
	});
	test("default start day should be Monday", () => {
		expect(getNormalizedDaysOfMonth(2023, 0)[0].day).toBe(1);
		expect(getNormalizedDaysOfMonth(2023, 1)[0].day).toBe(1);
		expect(getNormalizedDaysOfMonth(2023, 2)[0].day).toBe(1);
		expect(getNormalizedDaysOfMonth(2023, 3)[0].day).toBe(1);
		expect(getNormalizedDaysOfMonth(2023, 4)[0].day).toBe(1);
		expect(getNormalizedDaysOfMonth(2023, 5)[0].day).toBe(1);
		expect(getNormalizedDaysOfMonth(2023, 6)[0].day).toBe(1);
		expect(getNormalizedDaysOfMonth(2023, 7)[0].day).toBe(1);
		expect(getNormalizedDaysOfMonth(2023, 8)[0].day).toBe(1);
		expect(getNormalizedDaysOfMonth(2023, 9)[0].day).toBe(1);
		expect(getNormalizedDaysOfMonth(2023, 10)[0].day).toBe(1);
		expect(getNormalizedDaysOfMonth(2023, 11)[0].day).toBe(1);
	});
});

describe("getPaddedMonthDays Sunday", () => {
	test("default length", () => {
		const days = getNormalizedDaysOfMonth(2023, 1, 0);
		expect(days.length).toBe(42);
	});
	test("default start day should be Monday", () => {
		expect(getNormalizedDaysOfMonth(2023, 0, 0)[0].day).toBe(0);
		expect(getNormalizedDaysOfMonth(2023, 1, 0)[0].day).toBe(0);
		expect(getNormalizedDaysOfMonth(2023, 2, 0)[0].day).toBe(0);
		expect(getNormalizedDaysOfMonth(2023, 3, 0)[0].day).toBe(0);
		expect(getNormalizedDaysOfMonth(2023, 4, 0)[0].day).toBe(0);
		expect(getNormalizedDaysOfMonth(2023, 5, 0)[0].day).toBe(0);
		expect(getNormalizedDaysOfMonth(2023, 6, 0)[0].day).toBe(0);
		expect(getNormalizedDaysOfMonth(2023, 7, 0)[0].day).toBe(0);
		expect(getNormalizedDaysOfMonth(2023, 8, 0)[0].day).toBe(0);
		expect(getNormalizedDaysOfMonth(2023, 9, 0)[0].day).toBe(0);
		expect(getNormalizedDaysOfMonth(2023, 10, 0)[0].day).toBe(0);
		expect(getNormalizedDaysOfMonth(2023, 11, 0)[0].day).toBe(0);
	});
});

describe("getPaddedMonthDays Error", () => {
	test("wrong month return empty array", () => {
		expect(getNormalizedDaysOfMonth(2023, 25)).toEqual([]);
	});

	test("wrong start day should default to Monday", () => {
		expect(getNormalizedDaysOfMonth(2023, 0, 15)[0].day).toBe(1);
		expect(getNormalizedDaysOfMonth(2023, 1, 15)[0].day).toBe(1);
		expect(getNormalizedDaysOfMonth(2023, 2, 15)[0].day).toBe(1);
		expect(getNormalizedDaysOfMonth(2023, 3, 15)[0].day).toBe(1);
		expect(getNormalizedDaysOfMonth(2023, 4, 15)[0].day).toBe(1);
		expect(getNormalizedDaysOfMonth(2023, 5, 15)[0].day).toBe(1);
		expect(getNormalizedDaysOfMonth(2023, 6, 15)[0].day).toBe(1);
		expect(getNormalizedDaysOfMonth(2023, 7, 15)[0].day).toBe(1);
		expect(getNormalizedDaysOfMonth(2023, 8, 15)[0].day).toBe(1);
		expect(getNormalizedDaysOfMonth(2023, 9, 15)[0].day).toBe(1);
		expect(getNormalizedDaysOfMonth(2023, 10, 15)[0].day).toBe(1);
		expect(getNormalizedDaysOfMonth(2023, 11, 15)[0].day).toBe(1);
	});
});
