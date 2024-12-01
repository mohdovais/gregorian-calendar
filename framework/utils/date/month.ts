import { bound } from "../number";
import { leftPad } from "../string";
import { DateParts, DateString } from "./common";
import { isLeapYear } from "./validations";
import { dayOfDate } from "./zeller-rule";

const maxDaysInMonth = [
	31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
] as const;

function getDatesOfMonth(
	year: number,
	month: number,
	startDate = 1, // negative will be treated as length from end (endDate - startDate)
	endDate?: number,
) {
	// props sanity checks
	month = month | 0;
	if (month < 0 || month > 11) {
		return [];
	}
	year = year | 0;

	const daysInMonth =
		month === 1 && isLeapYear(year) ? 29 : maxDaysInMonth[month];
	endDate = endDate == null ? daysInMonth : Math.min(daysInMonth, endDate | 0);

	startDate = startDate | 0;
	startDate = bound(
		startDate < 0 ? endDate + startDate + 1 : startDate,
		1,
		endDate,
	);
	// end

	const mm = leftPad(month + 1, 2);
	const yyyy = leftPad(year, 4);
	// rome-ignore lint/style/noNonNullAssertion: <explanation>
	const firstDayOfMonth = dayOfDate(`${yyyy}-${mm}-01`)!;

	const result: DateParts[] = [];
	for (let date = startDate; date <= endDate; date++) {
		result.push({
			isoString: `${yyyy}-${mm}-${leftPad(date, 2)}` as DateString,
			day: (firstDayOfMonth + date - 1) % 7,
			year,
			month,
			date,
		});
	}
	return result;
}

export { getDatesOfMonth };
