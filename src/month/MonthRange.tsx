import { Button } from "../button/Button";
import { ensureArray } from "../util/array";
import { classname } from "../util/classname";
import {
	DateString,
	MAX_DATE_STRING,
	MIN_DATE_STRING,
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
import { useCallback, useEffect, useMemo, useState } from "react";

type DateRange = {
	start: string; //DateString;
	end: string; //DateString;
};

type DateStringRange = {
	start: DateString;
	end: DateString;
};

interface MonthRangeProps {
	className?: string;
	value?: DateRange;
	defaultValue?: DateRange;
	onChange?: (range: DateStringRange) => void;
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
}

function ensureDateRange(range?: DateRange): DateString[] {
	const result: DateString[] = [];
	if (range == null) return result;
	const start = ensureDateStringOrUndefined(range.start);
	const end = ensureDateStringOrUndefined(range.end);

	if (start != null) {
		result.push(start);
	}
	if (end != null) {
		result.push(end);
	}
	return result;
}

function MonthRange(props: MonthRangeProps) {
	const today = getToday();
	const {
		disabled = false,
		locale,
		dayNameFormat,
		className,
		onChange = noop,
	} = props;

	// props validations
	const controlledValue = ensureDateRange(props.value);
	const year = bound(notNullOrUndef(props.year, today.year) | 0, 0, 9999);
	const month = bound(notNullOrUndef(props.month, today.month) | 0, 0, 11);
	const weekStartDay = bound(notNullOrUndef(props.weekStartDay, 1) | 0, 0, 6);
	const min = ensureDateString(props.min, MIN_DATE_STRING);
	const max = ensureDateString(props.max, MAX_DATE_STRING);
	const disabledDays = new Set(ensureArray(props.disabledDays));
	const disabledDates = new Set(ensureArray(props.disabledDates));

	const isControlled = hasKey(props, "value");
	const [uncontrolledValue, setUncontrolled] = useState(() =>
		ensureDateRange(props.defaultValue),
	);

	const effectiveValue = isControlled ? controlledValue : uncontrolledValue;

	const completeSelection = uncontrolledValue.length === 2;
	const startDate = uncontrolledValue[0];
	const endDate = uncontrolledValue[1];

	const [hoveredDate, setHoverDate] = useState<DateString | null>(null);
	const hasHover = uncontrolledValue.length === 1 && hoveredDate != null;

	const callback = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			const dateString = (event.target as HTMLButtonElement).dataset.value as
				| DateString
				| undefined;

			if (dateString) {
				if (uncontrolledValue.length === 1) {
					const newState =
						uncontrolledValue[0] < dateString
							? uncontrolledValue.concat(dateString)
							: [dateString].concat(uncontrolledValue);
					setUncontrolled(newState);
					onChange({
						start: newState[0],
						end: newState[1],
					});
				} else {
					setUncontrolled(() => [dateString]);
				}
			}
		},
		[uncontrolledValue, onChange],
	);

	const onMouseOver = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			const el = event.target as HTMLButtonElement;
			const date = el.dataset.value;
			if (date) {
				setHoverDate(date as DateString);
			}
		},
		[],
	);

	const onMouseOut = useCallback(() => {
		setHoverDate(null);
	}, []);

	const days = useMemo(
		() => getPaddedMonthDays(year, month, weekStartDay),
		[year, month, weekStartDay],
	);

	return (
		<div className={classname([style.wrapper, style.range, className])}>
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
							data-value={isNullDate ? undefined : dateString}
							className={classname([
								dateString === today.isoString && style.today,
								dateString === startDate && style.start,
								dateString === endDate && style.end,
								completeSelection &&
									dateString > startDate &&
									dateString < endDate &&
									style.between,
								hasHover &&
									((dateString > startDate && dateString < hoveredDate) ||
										(dateString > hoveredDate && dateString < startDate)) &&
									style.between,

								!completeSelection && dateString === hoveredDate && style.hover,
							])}
							disabled={isDisabled}
							onClick={isNullDate ? undefined : callback}
							onMouseOver={
								isDisabled || completeSelection ? undefined : onMouseOver
							}
							onMouseOut={
								isDisabled || completeSelection ? undefined : onMouseOut
							}
						>
							{isNullDate ? null : day.date}
						</Button>
					);
				})}
			</div>
		</div>
	);
}

export { MonthRange };
export type { MonthRangeProps };
