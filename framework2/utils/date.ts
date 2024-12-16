type DateString = string & { name: "DateString"; format: "yyyy-dd-mm" };

const MIN_DATE_STRING = "0000-01-01" as DateString;
const MAX_DATE_STRING = "9999-12-31" as DateString;
const dateRegex = /(\d{4})-(\d{2})-(\d{2})/;
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const DEFAULT_LOCALE = "en-gb";

function ensureTwoDigits(number: number) {
    return `${number < 10 ? "0" : ""}${number}`;
}

const cache = new Map<string, string[]>();

function getMonthNames(
    format: "numeric" | "2-digit" | "long" | "short" | "narrow" = "long",
    locale = DEFAULT_LOCALE,
) {
    const key = "month" + format + (locale || "");
    let names = cache.get(key);
    if (names == null) {
        const formatter = new Intl.DateTimeFormat(locale, { month: format });
        names = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((m) =>
            formatter.format(new Date(2023, m, 1))
        );
        cache.set(key, names);
    }

    return names;
}

function getWeekdayNames(
    format: "long" | "short" | "narrow" = "long",
    locale = DEFAULT_LOCALE,
) {
    const key = "week" + format + (locale || "");
    let names = cache.get(key);
    if (names == null) {
        const formatter = new Intl.DateTimeFormat(locale, { weekday: format });
        names = [1, 2, 3, 4, 5, 6, 7].map((day) =>
            formatter.format(new Date(2023, 0, day))
        );
        cache.set(key, names);
    }

    return names;
}

function isDateString(date: string | undefined | null): date is DateString {
    return date != null && dateRegex.test(date) &&
        !isNaN(Date.parse(date));
}

// https://www.php.net/manual/en/datetime.format.php

function formatDate(
    dateObject: Date | undefined | null,
    format: string,
    locale = DEFAULT_LOCALE,
): string {
    if (dateObject == null || isNaN(dateObject.getTime())) {
        return "";
    }

    const day = dateObject.getDay();
    const date = dateObject.getDate();
    const month = dateObject.getMonth();
    const year = dateObject.getFullYear();

    return format.split("").map((ch) => {
        switch (ch) {
            case "d":
                return ensureTwoDigits(date);
            case "D":
                return getWeekdayNames("short", locale)[day];
            case "j":
                return date;
            case "l":
                return getWeekdayNames("long", locale)[day];
            case "N": {
                const d = day;
                return d === 0 ? 7 : d;
            }
            case "S": {
                const d = date % 10;
                return d === 1 ? "st" : d === 2 ? "nd" : d === 3 ? "rd" : "th";
            }
            case "w":
                return day;
            case "z":
                // The day of the year (from 0 through 365);
                return Math.floor(
                    (dateObject.getTime() -
                        new Date(year, 0, 1).getTime()) /
                        (1000 * 60 * 60 * 24),
                );

            case "W":
                // "The ISO-8601 week number of year (weeks starting on Monday)";
                return ch;
            case "F":
                return getMonthNames("long", locale)[month];
            case "m":
                return ensureTwoDigits(month + 1);
            case "M":
                return getMonthNames("short", locale)[month];
            case "n":
                return month + 1;
            case "t":
                // "The number of days in the given month";
                return month === 1 && year % 4 === 0
                    ? 29
                    : DAYS_IN_MONTH[month];
            case "L":
                return year % 4 === 0 ? 1 : 0;
            case "o":
                // "The ISO-8601 year number";
                return ch;
            case "Y":
                return year;
            case "y":
                return year % 100;
            case "a":
                return dateObject.getHours() < 12 ? "am" : "pm";
            case "A":
                return dateObject.getHours() < 12 ? "AM" : "PM";
            case "B":
                // Swatch Internet time (000 to 999)
                return ch;
            case "g":
                return dateObject.getHours() % 13;
            case "G":
                return dateObject.getHours();
            case "h":
                return ensureTwoDigits(dateObject.getHours() % 13);
            case "H":
                return ensureTwoDigits(dateObject.getHours());
            case "i":
                return ensureTwoDigits(dateObject.getMinutes());
            case "s":
                return ensureTwoDigits(dateObject.getSeconds());
            case "u":
                return dateObject.getMilliseconds();
            case "e":
                // The timezone identifier (Examples: UTC, GMT, Atlantic/Azores)
            case "I":
                // Whether the date is in daylights savings time (1 if Daylight Savings Time, 0 otherwise)
            case "O":
                // Difference to Greenwich time (GMT) in hours (Example: +0100)
            case "P":
                // Difference to Greenwich time (GMT) in hours:minutes (added in PHP 5.1.3)
            case "T":
                // Timezone abbreviations (Examples: EST, MDT)
                return ch;
            case "Z":
                return dateObject.getTimezoneOffset() * -60;
            case "c":
                return dateObject.toISOString();
            case "r":
                return dateObject.toLocaleDateString(locale);
            case "U":
                return Math.round(dateObject.getTime() / 1000);
            default:
                return ch;
        }
    }).join("");
}

export {
    formatDate,
    getMonthNames,
    getWeekdayNames,
    isDateString,
    MAX_DATE_STRING,
    MIN_DATE_STRING,
};

export type { DateString };
