import {
	DateString,
	convertToTDate,
	dayOfDate,
	decreaseMonth,
	ensureDateString,
	ensureDateStringOrUndefined,
	getDatesOfMonth,
	getDecade,
	getMonthNames,
	getToday,
	getWeekdayNames,
	increaseMonth,
	isDateStringFormat,
	isLeapYear,
	isValidDateString,
	parseDate,
	parseISODateStringToTDate,
} from "./index";

test("convertToTDate", () => {
	const date = new Date(2023, 1, 1);
	const notDate = new Date(NaN);
	expect(convertToTDate(date)).toEqual({
		date: 1,
		day: 3,
		isoString: "2023-02-01",
		month: 1,
		year: 2023,
	});

	expect(convertToTDate(notDate)).toBeUndefined();
});

test("dayOfDate", () => {
	expect(dayOfDate("")).toBeUndefined();
	expect(dayOfDate("2023-01-01")).toBe(0);
	expect(dayOfDate("2023-02-01")).toBe(3);
	expect(dayOfDate("2023-03-01")).toBe(3);
	expect(dayOfDate("2023-04-01")).toBe(6);
});

test("decreaseMonth", () => {
	expect(decreaseMonth(2023, 0, 1)).toEqual({ month: 11, year: 2022 });
	expect(decreaseMonth(2023, 1, 1)).toEqual({ month: 0, year: 2023 });
	expect(decreaseMonth(2023, 25, 1)).toEqual({ month: 10, year: 2023 });
});

test("ensureDateString", () => {
	expect(ensureDateString("", "2013-01-01" as DateString)).toBe("2013-01-01");
	expect(ensureDateString("2013-11-11", "2013-01-01" as DateString)).toBe(
		"2013-11-11",
	);
});

test("ensureDateStringOrUndefined", () => {
	expect(ensureDateStringOrUndefined("aaa")).toBeUndefined();
	expect(ensureDateStringOrUndefined("2013-13-01")).toBeUndefined();
	expect(ensureDateStringOrUndefined("2013-11-41")).toBeUndefined();
	expect(ensureDateStringOrUndefined("2013-01-01")).toBe("2013-01-01");
});

test("getDecade", () => {
	expect(getDecade(2023)).toEqual([
		2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029,
	]);

	expect(getDecade(2023, 5)).toEqual([
		2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026,
		2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034,
	]);
});

test("getMonth", () => {
	const month202302 = [
		{ date: 1, day: 3, isoString: "2023-02-01", month: 1, year: 2023 },
		{ date: 2, day: 4, isoString: "2023-02-02", month: 1, year: 2023 },
		{ date: 3, day: 5, isoString: "2023-02-03", month: 1, year: 2023 },
		{ date: 4, day: 6, isoString: "2023-02-04", month: 1, year: 2023 },
		{ date: 5, day: 0, isoString: "2023-02-05", month: 1, year: 2023 },
		{ date: 6, day: 1, isoString: "2023-02-06", month: 1, year: 2023 },
		{ date: 7, day: 2, isoString: "2023-02-07", month: 1, year: 2023 },
		{ date: 8, day: 3, isoString: "2023-02-08", month: 1, year: 2023 },
		{ date: 9, day: 4, isoString: "2023-02-09", month: 1, year: 2023 },
		{ date: 10, day: 5, isoString: "2023-02-10", month: 1, year: 2023 },
		{ date: 11, day: 6, isoString: "2023-02-11", month: 1, year: 2023 },
		{ date: 12, day: 0, isoString: "2023-02-12", month: 1, year: 2023 },
		{ date: 13, day: 1, isoString: "2023-02-13", month: 1, year: 2023 },
		{ date: 14, day: 2, isoString: "2023-02-14", month: 1, year: 2023 },
		{ date: 15, day: 3, isoString: "2023-02-15", month: 1, year: 2023 },
		{ date: 16, day: 4, isoString: "2023-02-16", month: 1, year: 2023 },
		{ date: 17, day: 5, isoString: "2023-02-17", month: 1, year: 2023 },
		{ date: 18, day: 6, isoString: "2023-02-18", month: 1, year: 2023 },
		{ date: 19, day: 0, isoString: "2023-02-19", month: 1, year: 2023 },
		{ date: 20, day: 1, isoString: "2023-02-20", month: 1, year: 2023 },
		{ date: 21, day: 2, isoString: "2023-02-21", month: 1, year: 2023 },
		{ date: 22, day: 3, isoString: "2023-02-22", month: 1, year: 2023 },
		{ date: 23, day: 4, isoString: "2023-02-23", month: 1, year: 2023 },
		{ date: 24, day: 5, isoString: "2023-02-24", month: 1, year: 2023 },
		{ date: 25, day: 6, isoString: "2023-02-25", month: 1, year: 2023 },
		{ date: 26, day: 0, isoString: "2023-02-26", month: 1, year: 2023 },
		{ date: 27, day: 1, isoString: "2023-02-27", month: 1, year: 2023 },
		{ date: 28, day: 2, isoString: "2023-02-28", month: 1, year: 2023 },
	];

	const month202002 = [
		{ date: 1, day: 6, isoString: "2020-02-01", month: 1, year: 2020 },
		{ date: 2, day: 0, isoString: "2020-02-02", month: 1, year: 2020 },
		{ date: 3, day: 1, isoString: "2020-02-03", month: 1, year: 2020 },
		{ date: 4, day: 2, isoString: "2020-02-04", month: 1, year: 2020 },
		{ date: 5, day: 3, isoString: "2020-02-05", month: 1, year: 2020 },
		{ date: 6, day: 4, isoString: "2020-02-06", month: 1, year: 2020 },
		{ date: 7, day: 5, isoString: "2020-02-07", month: 1, year: 2020 },
		{ date: 8, day: 6, isoString: "2020-02-08", month: 1, year: 2020 },
		{ date: 9, day: 0, isoString: "2020-02-09", month: 1, year: 2020 },
		{ date: 10, day: 1, isoString: "2020-02-10", month: 1, year: 2020 },
		{ date: 11, day: 2, isoString: "2020-02-11", month: 1, year: 2020 },
		{ date: 12, day: 3, isoString: "2020-02-12", month: 1, year: 2020 },
		{ date: 13, day: 4, isoString: "2020-02-13", month: 1, year: 2020 },
		{ date: 14, day: 5, isoString: "2020-02-14", month: 1, year: 2020 },
		{ date: 15, day: 6, isoString: "2020-02-15", month: 1, year: 2020 },
		{ date: 16, day: 0, isoString: "2020-02-16", month: 1, year: 2020 },
		{ date: 17, day: 1, isoString: "2020-02-17", month: 1, year: 2020 },
		{ date: 18, day: 2, isoString: "2020-02-18", month: 1, year: 2020 },
		{ date: 19, day: 3, isoString: "2020-02-19", month: 1, year: 2020 },
		{ date: 20, day: 4, isoString: "2020-02-20", month: 1, year: 2020 },
		{ date: 21, day: 5, isoString: "2020-02-21", month: 1, year: 2020 },
		{ date: 22, day: 6, isoString: "2020-02-22", month: 1, year: 2020 },
		{ date: 23, day: 0, isoString: "2020-02-23", month: 1, year: 2020 },
		{ date: 24, day: 1, isoString: "2020-02-24", month: 1, year: 2020 },
		{ date: 25, day: 2, isoString: "2020-02-25", month: 1, year: 2020 },
		{ date: 26, day: 3, isoString: "2020-02-26", month: 1, year: 2020 },
		{ date: 27, day: 4, isoString: "2020-02-27", month: 1, year: 2020 },
		{ date: 28, day: 5, isoString: "2020-02-28", month: 1, year: 2020 },
		{ date: 29, day: 6, isoString: "2020-02-29", month: 1, year: 2020 },
	];

	expect(getDatesOfMonth(2023, 1)).toEqual(month202302);
	expect(getDatesOfMonth(2020, 1)).toEqual(month202002);
	expect(getDatesOfMonth(2023, 25)).toEqual([]);
});

test("getMonthNames", () => {
	const engShort = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];
	const engLong = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	const plLong = [
		"styczeń",
		"luty",
		"marzec",
		"kwiecień",
		"maj",
		"czerwiec",
		"lipiec",
		"sierpień",
		"wrzesień",
		"październik",
		"listopad",
		"grudzień",
	];
	expect(getMonthNames("short")).toEqual(engShort);
	expect(getMonthNames("long")).toEqual(engLong);
	expect(getMonthNames("long", "pl")).toEqual(plLong);
});

test("getWeekNames", () => {
	expect(getWeekdayNames()).toEqual([
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	]);

	expect(getWeekdayNames("narrow")).toEqual([
		"S",
		"M",
		"T",
		"W",
		"T",
		"F",
		"S",
	]);

	expect(getWeekdayNames("short")).toEqual([
		"Sun",
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat",
	]);

	expect(getWeekdayNames("long", "pl")).toEqual([
		"niedziela",
		"poniedziałek",
		"wtorek",
		"środa",
		"czwartek",
		"piątek",
		"sobota",
	]);
});

test("increaseMonth", () => {
	expect(increaseMonth(2022, 12)).toEqual({ month: 0, year: 2023 });
	expect(increaseMonth(2022, 0)).toEqual({ month: 1, year: 2022 });
});

test("isDateStringFormat", () => {
	expect(isDateStringFormat("")).toBe(false);
	expect(isDateStringFormat("2022-02-32")).toBe(true);
	expect(isDateStringFormat("2020-02-29")).toBe(true);
});

test("getToday", () => {
	const now = new Date();
	expect(getToday()).toEqual({
		date: now.getDate(),
		day: now.getDay(),
		isoString: now.toISOString().split("T")[0],
		month: now.getMonth(),
		year: now.getFullYear(),
	});
});

test("isLeapYear", () => {
	expect(isLeapYear(2022)).toBe(false);
	expect(isLeapYear(2020)).toBe(true);
});

test("isValidDateString", () => {
	expect(isValidDateString("2022-02-32")).toBe(false);
	expect(isValidDateString("2020-02-29")).toBe(true);
});

test("parseDate", () => {
	expect(parseDate("10 Nov 2020")).toBe("2020-11-10");
	expect(parseDate("10 Nov, 2020")).toBe("2020-11-10");
	expect(parseDate("10 nov, 2020")).toBe("2020-11-10");
	expect(parseDate("10 november, 2020")).toBe("2020-11-10");
	expect(parseDate("10/nov/2020")).toBe("2020-11-10");

	expect(parseDate("Nov 10 2020")).toBe("2020-11-10");
	expect(parseDate("Nov 10, 2020")).toBe("2020-11-10");
	expect(parseDate("nov 10 2020")).toBe("2020-11-10");
	expect(parseDate("november 10, 2020")).toBe("2020-11-10");
	expect(parseDate("nov 10/2020")).toBe("2020-11-10");

	expect(parseDate("10 11 2020")).toBe("2020-11-10");
	expect(parseDate("10/11/2020")).toBe("2020-11-10");
	expect(parseDate("10.11.2020")).toBe("2020-11-10");
	expect(parseDate("10-11-2020")).toBe("2020-11-10");

	expect(parseDate("2020 11 10")).toBe("2020-11-10");
	expect(parseDate("2020-11-10")).toBe("2020-11-10");
	expect(parseDate("2020.11.10")).toBe("2020-11-10");

	expect(parseDate("lorem")).toBeUndefined();
	expect(parseDate("10 lorem, 2020")).toBeUndefined();
	expect(parseDate("32 Nov 2020")).toBeUndefined();
	expect(parseDate("25 25 2020")).toBeUndefined();
	expect(parseDate("2020-25-25")).toBeUndefined();
});

test("parseISODateString", () => {
	expect(parseISODateStringToTDate()).toBeUndefined();
	expect(parseISODateStringToTDate("2022-02-32")).toBeUndefined();
	expect(parseISODateStringToTDate("2020-02-29")).toEqual({
		date: 29,
		day: 6,
		isoString: "2020-02-29",
		month: 1,
		year: 2020,
	});
});
