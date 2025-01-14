import { DateString, getMonthNames } from "./date";
import { escapeRegExpString } from "./string";

const DEFAULT_DATE_FORMAT = "d/m/Y";

/*
d	Day of the month, 2 digits with leading zeros	01 to 31
j	Day of the month without leading zeros	1 to 31

F	A full textual representation of a month, such as January or March	January through December
m	Numeric representation of a month, with leading zeros	01 through 12
M	A short textual representation of a month, three letters	Jan through Dec
n	Numeric representation of a month, without leading zeros	1 through 12

Y	A at least four digit representation of a year Examples: 2024 or 1985
y	A two digit representation of a year	Examples: 99 or 03
*/
function isValidDateFormat(format: string): boolean {
    let date = 0;
    let month = 0;
    let year = 0;

    for (let i = 0, l = format.length; i < l; i++) {
        switch (format[i]) {
            case "d":
            case "j":
                date += 1;
                break;
            case "F":
            case "m":
            case "M":
            case "n":
                month += 1;
                break;
            case "Y":
            case "y":
                year += 1;
        }
    }

    return date === 1 && month === 1 && year === 1;
}

type DateParserRegExp = {
    regexp: RegExp;
    yearType?: "2-digit" | "4-digit";
    monthType?: "numeric" | "2-digit" | "long" | "short";
    dayType?: "numeric" | "2-digit";
};

function getDateParserRegExp(format: string): DateParserRegExp {
    format = format.trim();

    if (format === "" || !isValidDateFormat(format)) {
        format = DEFAULT_DATE_FORMAT;
    }

    format = escapeRegExpString(format);
    let dayType: DateParserRegExp["dayType"];
    let monthType: DateParserRegExp["monthType"];
    let yearType: DateParserRegExp["yearType"];

    const regexString = format.split("").map((char) => {
        switch (char) {
            case "d":
                dayType = "2-digit";
                return "(?<day>\\d{2})";
            case "j":
                dayType = "numeric";
                return "(?<day>\\d{1,2})";
            case "F":
                monthType = "long";
                return "(?<month>\\w+)";
            case "M":
                monthType = "short";
                return "(?<month>\\w+)";
            case "m":
                monthType = "2-digit";
                return "(?<month>\\d{2})";
            case "n":
                monthType = "numeric";
                return "(?<month>\\d{1,2})";
            case "Y":
                yearType = "4-digit";
                return "(?<year>\\d{4})";
            case "y":
                yearType = "2-digit";
                return "(?<year>\\d{2})";
            default:
                return char;
        }
    }).join("");

    return {
        regexp: new RegExp(regexString),
        yearType,
        monthType,
        dayType,
    };
}

function ensureTwoDigit(number: number): string | undefined {
    if (number < 0) {
        return;
    }

    return number < 10 ? "0" + number : String(number);
}

function getMonth(
    month: string,
    monthType: DateParserRegExp["monthType"],
    locale: string,
): string | undefined {
    switch (monthType) {
        case "2-digit":
            return month;
        case "numeric":
            return ensureTwoDigit(parseInt(month));
        case "short":
        case "long": {
            let index = getMonthNames(monthType, locale).findIndex((name) =>
                name.localeCompare(month) === 1
            );
            return index > -1 ? ensureTwoDigit(index + 1) : undefined;
        }
    }
}

function createDateParser(format: string, locale = "en-GB") {
    const { regexp, dayType, monthType, yearType } = getDateParserRegExp(
        format,
    );

    return (str: string) => {
        const exec = regexp.exec(str);

        if (exec == null) {
            return;
        }

        const { day, month, year } = exec.groups || {};

        const dd = dayType == null
            ? undefined
            : dayType === "numeric"
            ? parseInt(day) < 10 ? "0" + day : day
            : day;

        const yyyy = yearType === "2-digit" ? "20" + year : year;

        const mm = getMonth(month, monthType, locale);

        const dateString = dd == null || mm == null
            ? undefined
            : `${yyyy}-${mm}-${dd}`;

        return dateString == null
            ? undefined
            : isNaN(Date.parse(dateString))
            ? undefined
            : dateString as DateString;
    };
}

export { createDateParser };
