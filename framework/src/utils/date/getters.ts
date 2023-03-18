import { bound } from "../number";
import type { DateParts } from "./common";
import { convertToTDate } from "./parser";

function getToday(): DateParts {
	return convertToTDate(new Date())!;
}

function increaseMonth(year: number, month: number, encrement = 1) {
	month = bound(month, 0, 11);
	const total = (year | 0) * 12 + (month | 0) + (encrement | 0);
	return { year: (total / 12) | 0, month: total % 12 };
}

function decreaseMonth(year: number, month: number, decrement = 1) {
	return increaseMonth(year, month, -decrement);
}

function getDecade(year: number, padding = 0) {
	const start = Math.max(0, ((year / 10) | 0) * 10 - padding);
	const total = 10 + 2 * padding;
	const years: number[] = [];
	for (let i = 0; i < total; i++) {
		years.push(start + i);
	}
	return years;
}

export { increaseMonth, decreaseMonth, getToday, getDecade };
