import { StockButton } from "../button";
import { ensureArray } from "../utils/array";
import { classname } from "../utils/classname";
import {
	DateString,
	MAX_DATE_STRING,
	MIN_DATE_STRING,
	ensureDateString,
	ensureDateStringOrUndefined,
	getToday,
} from "../utils/date";
import { noop } from "../utils/function";
import { bound } from "../utils/number";
import { ensureNotNullOrUndefined as notNullOrUndef } from "../utils/object";
import { WeekHeader, WeekHeaderProps } from "./Header";
import style from "./Month.module.css";
import { getNormalizedDaysOfMonth } from "./util";
import { useCallback, useMemo, useRef, useState } from "react";

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
	const year = bound(notNullOrUndef(props.year, today.year) | 0, 0, 9999);
	const month = bound(notNullOrUndef(props.month, today.month) | 0, 0, 11);
	const weekStartDay = bound(notNullOrUndef(props.weekStartDay, 1) | 0, 0, 6);
	const min = ensureDateString(props.min, MIN_DATE_STRING);
	const max = ensureDateString(props.max, MAX_DATE_STRING);
	const disabledDays = new Set(ensureArray(props.disabledDays));
	const disabledDates = new Set(ensureArray(props.disabledDates));

	const uncontrolledValue = useRef(ensureDateRange(props.defaultValue));
	const currentValue = uncontrolledValue.current;

	// const isControlled = hasKey(props, "value");
	// const controlledValue = isControlled ? ensureDateRange(props.value): [];
	// const effectiveValue = isControlled ? controlledValue : uncontrolledValue;

	const isRangeSelected = currentValue.length === 2;
	const startDate = currentValue[0];
	const endDate = currentValue[1];
	const [_, forceRender] = useState(1);

	const [hoveredDate, setHoverDate] = useState<DateString | null>(null);
	const hasHover = currentValue.length === 1 && hoveredDate != null;

	const onClick = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			const dateString = ensureDateStringOrUndefined(
				(event.target as HTMLButtonElement).dataset.value,
			);

			if (!dateString) {
				return;
			}
			const currentValue = uncontrolledValue.current;

			if (currentValue.length === 1) {
				const newState =
					currentValue[0] < dateString
						? currentValue.concat(dateString)
						: [dateString].concat(currentValue);

				uncontrolledValue.current = newState;
				onChange({
					start: newState[0],
					end: newState[1],
				});
			} else {
				uncontrolledValue.current = [dateString];
			}

			forceRender((x) => x + 1);
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
		() => getNormalizedDaysOfMonth(year, month, weekStartDay),
		[year, month, weekStartDay],
	);

	return (
		<div className={classname(style.wrapper, style.range, className)}>
			<WeekHeader format={dayNameFormat} locale={locale} start={weekStartDay} />
			<div className={style.days}>
				{days.map((day) => {
					const dateString = day.isoString;
					const isAnotherMonth = day.month !== month || day.year !== year;
					const isDisabled =
						isAnotherMonth ||
						disabled ||
						disabledDates.has(dateString) ||
						disabledDays.has(day.day) ||
						dateString < min ||
						dateString > max;
					const isMouseEventDisabled = isDisabled || isRangeSelected;
					const className = classname([
						dateString === today.isoString && style.today,
						dateString === startDate && style.start,
						dateString === endDate && style.end,
						isRangeSelected &&
							dateString > startDate &&
							dateString < endDate &&
							style.between,
						hasHover &&
							((dateString > startDate && dateString < hoveredDate) ||
								(dateString > hoveredDate && dateString < startDate)) &&
							style.between,

						!isRangeSelected && dateString === hoveredDate && style.hover,
					]);

					return (
						<StockButton
							key={dateString}
							data-value={dateString}
							className={className}
							disabled={isDisabled}
							onClick={isAnotherMonth ? undefined : onClick}
							onMouseOver={isMouseEventDisabled ? undefined : onMouseOver}
							onMouseOut={isMouseEventDisabled ? undefined : onMouseOut}
						>
							{day.date}
						</StockButton>
					);
				})}
			</div>
		</div>
	);
}

export { MonthRange };
export type { MonthRangeProps };
