import { DateString } from "./common";

function datedisplay(x?: DateString, locale?: string) {
	const formatter = new Intl.DateTimeFormat(locale, {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	return x == null ? undefined : formatter.format(Date.parse(x));
}

export { datedisplay };
