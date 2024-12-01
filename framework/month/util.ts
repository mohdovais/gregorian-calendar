import {
	DateParts,
	decreaseMonth,
	getDatesOfMonth,
	increaseMonth,
} from "../utils/date";

function getNormalizedDaysOfMonth(
	year: number,
	month: number,
	startDay = 1,
	padding = 42,
) {
	const days = getDatesOfMonth(year, month);

	if (days.length === 0) {
		return [];
	}

	startDay = startDay | 0;
	startDay = startDay < 0 || startDay > 6 ? 1 : startDay;

	const prefixCount = (7 - startDay + days[0].day) % 7;
	const suffixCount = padding - prefixCount - days.length + 1;

	let prefix: DateParts[] = [];
	if (prefixCount > 0) {
		const { month: prevMonth, year: prevYear } = decreaseMonth(year, month);
		prefix = getDatesOfMonth(prevYear, prevMonth, 0 - prefixCount);
	}

	let suffix: DateParts[] = [];
	if (suffixCount > 0) {
		const { month: nextMonth, year: nextYear } = increaseMonth(year, month);
		suffix = getDatesOfMonth(nextYear, nextMonth, 1, suffixCount - 1);
	}

	return prefix.concat(days, suffix);
}

/*
function getWeeksOfMonth(
	year: number,
	month: number,
	startDay = 1,
	padding?: number,
) {
	const days = getNormalizedDaysOfMonth(year, month, startDay, padding);
	const weeks: (TDate | null)[][] = [];

	const week = 7;
	for (let i = 0; i < days.length; i += week) {
		const chunk = days.slice(i, i + week);
		weeks.push(chunk);
	}
	return weeks;
}
*/

export { getNormalizedDaysOfMonth };
