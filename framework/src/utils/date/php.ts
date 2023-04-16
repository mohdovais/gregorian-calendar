import { ensureTwoDigits } from "./format";
import { getMonthNames, getWeekdayNames } from "./names";

// https://www.php.net/manual/en/datetime.format.php

function formatDate(date: Date, format: string, locale?: string) {
	return format.split("").map((ch) => {
		switch (ch) {
			case "d":
				return ensureTwoDigits(date.getDate());
			case "D":
				return getWeekdayNames("short", locale)[date.getDay()];
			case "j":
				return date.getDate();
			case "l":
				return getWeekdayNames("long", locale)[date.getDay()];
			case "N": {
				const d = date.getDay();
				return d === 0 ? 7 : d;
			}
			case "S": {
				const d = date.getDate() % 10;
				return d === 1 ? "st" : d === 2 ? "nd" : d === 3 ? "rd" : "th";
			}
			case "w":
				return date.getDay();
			//case "z":
			//return "The day of the year (from 0 through 365)";
			case "W":
				return "The ISO-8601 week number of year (weeks starting on Monday)";
			case "F":
				return getMonthNames("long", locale)[date.getMonth()];
			case "m":
				return ensureTwoDigits(date.getMonth());
			case "M":
				return getMonthNames("short", locale)[date.getMonth()];
			case "n":
				return date.getMonth();
			case "t":
				return "The number of days in the given month";
			case "L":
				return date.getFullYear() % 4 === 0 ? 1 : 0;
			case "o":
				return "The ISO-8601 year number";
			case "Y":
				return date.getFullYear();
			case "y":
				return date.getFullYear() % 100;
			case "a":
				return date.getHours() < 12 ? "am" : "pm";
			case "A":
				return date.getHours() < 12 ? "AM" : "PM";
			case "B":
				return "Swatch Internet time (000 to 999)";
			case "g":
				return date.getHours() % 13;
			case "G":
				return date.getHours();
			case "h":
				return ensureTwoDigits(date.getHours() % 13);
			case "H":
				return ensureTwoDigits(date.getHours());
			case "i":
				return ensureTwoDigits(date.getMinutes());
			case "s":
				return ensureTwoDigits(date.getSeconds());
			case "u":
				return date.getMilliseconds();
			case "e":
				return "The timezone identifier (Examples: UTC, GMT, Atlantic/Azores)";
			case "I":
				return "Whether the date is in daylights savings time (1 if Daylight Savings Time, 0 otherwise)";
			case "O":
				return "Difference to Greenwich time (GMT) in hours (Example: +0100)";
			case "P":
				return "Difference to Greenwich time (GMT) in hours:minutes (added in PHP 5.1.3)";
			case "T":
				return "Timezone abbreviations (Examples: EST, MDT)";
			case "Z":
				return date.getTimezoneOffset() * -60;
			case "c":
				return date.toISOString();
			case "r":
				return date.toLocaleDateString(locale);
			case "U":
				return Math.round(date.getTime() / 1000);
			default:
				return ch;
		}
	});
}

export { formatDate };
