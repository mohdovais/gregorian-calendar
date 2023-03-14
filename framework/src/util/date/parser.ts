import { DateParts, DateString } from "./common";
import { ensureTwoDigits } from "./format";
import { getMonthNames } from "./names";
import { ensureDateStringOrUndefined } from "./validations";

function parseISODateStringToTimestamp(
	dateString?: string | null,
): undefined | number {
	if (!dateString) {
		return;
	}

	const timestamp = Date.parse(`${dateString}T23:23:23.0Z`);

	if (isNaN(timestamp)) {
		return;
	}

	return timestamp;
}

function parseISODateStringToTDate(
	dateString?: string | undefined,
): DateParts | undefined {
	const timestamp = parseISODateStringToTimestamp(dateString);
	return timestamp == null ? undefined : convertToTDate(new Date(timestamp));
}

function convertToTDate(date: Date): DateParts | undefined {
	return isNaN(date.getTime())
		? undefined
		: {
				date: date.getDate(),
				day: date.getDay(),
				isoString: date.toISOString().split("T")[0] as DateString,
				month: date.getMonth(),
				year: date.getFullYear(),
		  };
}

// 20 Mar, 2023
const dMyRe = /(?<date>\d{1,2})[ ./,-]+(?<month>[a-z]+)[ ./,-]+(?<year>\d{4})/i;

// Mar 20, 2023
const MdyRe = /(?<month>[a-z]+)[ ./,-]+(?<date>\d{1,2})[ ./,-]+(?<year>\d{4})/i;

// 20/12/2023
const ddmmyyyyRe =
	/(?<date>\d{1,2})[ ./,-]+(?<month>\d{1,2})[ ./,-]+(?<year>\d{4})/i;

const yyyymmddRe =
	/(?<year>\d{4})[ ./,-]+(?<month>\d{2})[ ./,-]+(?<date>\d{2})/;

function _getAllMonthNames(locale?: string) {
	return {
		long: getMonthNames("long", locale).map((name) =>
			name.toLocaleLowerCase(locale),
		),
		short: getMonthNames("short", locale).map((name) =>
			name.toLocaleLowerCase(locale),
		),
	};
}

function _tryWithMonthName(groups: Record<string, string>, locale?: string) {
	const { long, short } = _getAllMonthNames();
	let { date, month: monthName, year } = groups;
	date = ensureTwoDigits(date);
	monthName = monthName.toLocaleLowerCase(locale);

	let month = short.indexOf(monthName);
	if (month === -1) {
		month = long.indexOf(monthName);
	}

	if (month === -1) {
		return;
	}

	const dateString = `${year}-${ensureTwoDigits(month + 1)}-${date}`;

	return isNaN(Date.parse(`${dateString}T23:23:23.123Z`))
		? undefined
		: (dateString as DateString);
}

function _tryWithMonthNumber(groups: Record<string, string>) {
	let { date, month, year } = groups;

	date = ensureTwoDigits(date);
	month = ensureTwoDigits(month);

	const dateString = `${year}-${month}-${date}`;

	return isNaN(Date.parse(`${dateString}T23:23:23.123Z`))
		? undefined
		: (dateString as DateString);
}

function parseDate(str: string, locale?: string) {
	if (dMyRe.test(str)) {
		return _tryWithMonthName(dMyRe.exec(str)!.groups!, locale);
	}

	if (MdyRe.test(str)) {
		return _tryWithMonthName(MdyRe.exec(str)!.groups!, locale);
	}

	if (ddmmyyyyRe.test(str)) {
		const { date, month, year } = ddmmyyyyRe.exec(str)!.groups!;
		return (
			_tryWithMonthNumber({ date, month, year }) ||
			_tryWithMonthNumber({ date: month, month: date, year })
		);
	}

	if (yyyymmddRe.test(str)) {
		return _tryWithMonthNumber(yyyymmddRe.exec(str)!.groups!);
	}

	return;
}

export {
	parseISODateStringToTDate,
	parseISODateStringToTimestamp,
	convertToTDate,
	parseDate,
};
