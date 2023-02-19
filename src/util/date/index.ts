type Enumerate<
	N extends number,
	Acc extends number[] = [],
> = Acc["length"] extends N
	? Acc[number]
	: Enumerate<N, [...Acc, Acc["length"]]>;

type Brand<K, T> = K & { name: T; format: "yyyy-dd-mm" };
type DateString = Brand<string, "DateString">;

type TDate = {
	isoString: DateString;
	year: number;
	month: number;
	date: number;
	day: number;
};

const MIN_DATE_STRING = "0000-01-01" as DateString;
const MAX_DATE_STRING = "9999-12-31" as DateString;

function leftPad(item: string | number, length: number, pad = "0") {
	let x = String(item);
	while (x.length < length) {
		x = pad + x;
	}
	return x;
}

function parseISODateString(dateString?: string | null): TDate | null {
	if (!dateString) {
		return null;
	}

	const timestamp = Date.parse(`${dateString}T23:23:23.123Z`);

	if (isNaN(timestamp)) {
		return null;
	}

	return _convertDate(new Date(timestamp));
}

function _convertDate(date: Date): TDate {
	return {
		date: date.getDate(),
		day: date.getDay(),
		isoString: date.toISOString().split("T")[0] as DateString,
		month: date.getMonth(),
		year: date.getFullYear(),
	};
}

function getToday(): TDate {
	return _convertDate(new Date());
}

function increaseMonth(year: number, month: number, encrement = 1) {
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

export {
	leftPad,
	parseISODateString,
	increaseMonth,
	decreaseMonth,
	getToday,
	getDecade,
	MIN_DATE_STRING,
	MAX_DATE_STRING,
};
export * from "./month";
export * from "./names";
export * from "./validations";

export type { Enumerate, TDate, DateString };
