import { Button } from "../button/Button";
import { ensureArray } from "../util/array";
import { classname } from "../util/classname";
import {
	DateString,
	MAX_DATE_STRING,
	MIN_DATE_STRING,
	TDate,
	ensureDateString,
	ensureDateStringOrUndefined,
	getPaddedMonthDays,
	getToday,
} from "../util/date";
import { noop } from "../util/function";
import { bound } from "../util/number";
import {
	ensureNotNullOrUndefined as notNullOrUndef,
	hasKey,
} from "../util/object";
import { WeekHeader, WeekHeaderProps } from "./Header";
import style from "./Month.module.css";
import { useMemo, useState } from "react";

interface MonthProps {
	className?: string;
	value?: string; //DateString;
	defaultValue?: string; //DateString;
	year?: number;
	month?: number;
	weekStartDay?: number;
	min?: string; //DateString;
	max?: string; //DateString;
	disabled?: boolean;
	disabledDates?: string[]; //DateString[]
	disabledDays?: number[];
	locale?: string;
	dayNameFormat?: WeekHeaderProps["format"];
	onChange?: (date: DateString) => void;
}

function Month(props: MonthProps) {
	const today = getToday();
	const {
		disabled = false,
		locale,
		dayNameFormat,
		className,
		onChange = noop,
	} = props;

	// props validations
	const value = ensureDateStringOrUndefined(props.value);
	const year = bound(notNullOrUndef(props.year, today.year) | 0, 0, 9999);
	const month = bound(notNullOrUndef(props.month, today.month) | 0, 0, 11);
	const weekStartDay = bound(notNullOrUndef(props.weekStartDay, 1) | 0, 0, 6);
	const min = ensureDateString(props.min, MIN_DATE_STRING);
	const max = ensureDateString(props.max, MAX_DATE_STRING);
	const disabledDays = new Set(ensureArray(props.disabledDays));
	const disabledDates = new Set(ensureArray(props.disabledDates));

	const isControlled = hasKey(props, "value");
	const [vState, setState] = useState(() =>
		ensureDateStringOrUndefined(props.defaultValue),
	);
	const effectiveValue = isControlled ? value : vState;

	const days = useMemo(
		() => getPaddedMonthDays(year, month, weekStartDay),
		[year, month, weekStartDay],
	);

	const callback = (date: TDate) => {
		!isControlled && setState(date.isoString);
		typeof onChange === "function" && onChange(date.isoString);
	};

	return (
		<div className={classname([style.wrapper, className])}>
			<WeekHeader format={dayNameFormat} locale={locale} start={weekStartDay} />
			<div className={style.days}>
				{days.map((day, i) => {
					const isNullDate = day == null;
					const dateString = isNullDate ? MIN_DATE_STRING : day.isoString;

					const isDisabled =
						isNullDate ||
						disabled ||
						disabledDates.has(dateString) ||
						disabledDays.has(day.day) ||
						dateString < min ||
						dateString > max;

					return (
						<Button
							key={isNullDate ? "null-" + i : dateString}
							className={classname([
								dateString === today.isoString && style.today,
								dateString === effectiveValue && style.selected,
							])}
							disabled={isDisabled}
							onClick={isNullDate ? undefined : () => callback(day)}
						>
							{isNullDate ? null : day.date}
						</Button>
					);
				})}
			</div>
		</div>
	);
}

export { Month };
export type { MonthProps };
