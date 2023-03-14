import { DateString } from "./common";

function format(x?: DateString, locale?: string) {
	const formatter = new Intl.DateTimeFormat(locale, {
		year: "numeric",
		month: "short",
		day: "numeric",
	});

	console.log(formatter.formatToParts(new Date()));

	return x == null ? "" : formatter.format(Date.parse(x));
}

function ensureTwoDigits(n: number | string) {
	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	const m = (n as any) | 0;
	return m < 99 ? (m < 10 ? "0" : "") + m : "" + m;
}

export { format, ensureTwoDigits };
