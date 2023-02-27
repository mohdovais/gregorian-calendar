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

export type { Enumerate, DateString, TDate };

export { MIN_DATE_STRING, MAX_DATE_STRING };
