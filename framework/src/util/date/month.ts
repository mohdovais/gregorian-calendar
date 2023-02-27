import { leftPad } from "../string";
import { DateString, TDate } from "./common";
import { isLeapYear } from "./validations";
import { dayOfDate } from "./zeller-rule";

const maxDaysInMonth = [
	31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
] as const;

function getMonth(year: number, month: number) {
	month = month | 0;
	if (month < 0 || month > 11) {
		return [];
	}
	year = year | 0;
	const mm = leftPad(month + 1, 2);
	const yyyy = leftPad(year, 4);
	const maxDay = month === 1 && isLeapYear(year) ? 29 : maxDaysInMonth[month];
	const result: TDate[] = [];
	let day = dayOfDate(`${yyyy}-${mm}-01`)!;
	for (let date = 1; date <= maxDay; date++) {
		const isoString = `${yyyy}-${mm}-${leftPad(date, 2)}` as DateString;
		result.push({
			isoString,
			year,
			month,
			date,
			day,
		});
		day = (1 + day) % 7;
	}

	return result;
}

function getPaddedMonthDays(
	year: number,
	month: number,
	startDay = 1,
	padding = 42,
) {
	const days = getMonth(year, month);

	if (days.length === 0) {
		return [];
	}

	startDay = startDay | 0;
	startDay = startDay < -1 || startDay > 6 ? 1 : startDay;

	const prefix = Array<null | TDate>((7 + days[0].day - startDay) % 7).fill(
		null,
		0,
	);

	const suffix = Array<null>(padding - prefix.length - days.length).fill(
		null,
		0,
	);

	return prefix.concat(days, suffix);
}

function getWeeksOfMonth(
	year: number,
	month: number,
	startDay = 1,
	padding?: number,
) {
	const days = getPaddedMonthDays(year, month, startDay, padding);
	const weeks: (TDate | null)[][] = [];

	const week = 7;
	for (let i = 0; i < days.length; i += week) {
		const chunk = days.slice(i, i + week);
		weeks.push(chunk);
	}
	return weeks;
}

export { getMonth, getWeeksOfMonth, getPaddedMonthDays };
