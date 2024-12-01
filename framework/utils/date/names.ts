const cache = new Map<string, string[]>();

function getMonthNames(
	format: "numeric" | "2-digit" | "long" | "short" | "narrow" = "long",
	locale?: string,
) {
	const key = "month" + format + (locale || "");
	let names = cache.get(key);
	if (names == null) {
		const formatter = new Intl.DateTimeFormat(locale, { month: format });
		names = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((m) =>
			formatter.format(new Date(2023, m, 1)),
		);
		cache.set(key, names);
	}

	return names;
}

function getWeekdayNames(
	format: "long" | "short" | "narrow" = "long",
	locale?: string,
) {
	const key = "week" + format + (locale || "");
	let names = cache.get(key);
	if (names == null) {
		const formatter = new Intl.DateTimeFormat(locale, { weekday: format });
		names = [1, 2, 3, 4, 5, 6, 7].map((day) =>
			formatter.format(new Date(2023, 0, day)),
		);
		cache.set(key, names);
	}

	return names;
}

export { getMonthNames, getWeekdayNames };
