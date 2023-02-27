import { DateString, TDate } from "./common";

function parseISODateString(dateString?: string | null): TDate | null {
	if (!dateString) {
		return null;
	}

	const timestamp = Date.parse(`${dateString}T23:23:23.123Z`);

	if (isNaN(timestamp)) {
		return null;
	}

	return convertToTDate(new Date(timestamp));
}

function convertToTDate(date: Date): TDate {
	return {
		date: date.getDate(),
		day: date.getDay(),
		isoString: date.toISOString().split("T")[0] as DateString,
		month: date.getMonth(),
		year: date.getFullYear(),
	};
}

export { parseISODateString, convertToTDate };
