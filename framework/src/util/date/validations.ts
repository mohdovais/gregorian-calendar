import { DateString } from "./common";

const dateRe = /(\d{4})-(\d{2})-(\d{2})/;

function isLeapYear(year: number) {
	return year % 4 === 0;
}

function isDateStringFormat(dateString?: string | null) {
	return dateString != null && dateRe.test(dateString);
}

function isValidDateString(
	dateString?: string | null,
): dateString is DateString {
	return (
		isDateStringFormat(dateString) &&
		!isNaN(Date.parse(`${dateString}T23:23:23.123Z`))
	);
}

function ensureDateString(
	dateString: string | undefined | null,
	defaultValue: DateString,
) {
	return isValidDateString(dateString) ? dateString : defaultValue;
}

function ensureDateStringOrUndefined(dateString: string | undefined | null) {
	return isValidDateString(dateString) ? dateString : undefined;
}

export {
	isLeapYear,
	isDateStringFormat,
	isValidDateString,
	ensureDateString,
	ensureDateStringOrUndefined,
};
