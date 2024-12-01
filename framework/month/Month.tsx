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
import {
	ensureNotNullOrUndefined as notNullOrUndef,
	hasKey,
} from "../utils/object";
import { WeekHeader, WeekHeaderProps } from "./Header";
import style from "./Month.module.css";
import { getNormalizedDaysOfMonth } from "./util";
import { useCallback, useMemo, useState } from "react";

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
	const year = bound(notNullOrUndef(props.year, today.year) | 0, 0, 9999);
	const month = bound(notNullOrUndef(props.month, today.month) | 0, 0, 11);
	const weekStartDay = bound(notNullOrUndef(props.weekStartDay, 1) | 0, 0, 6);
	const min = ensureDateString(props.min, MIN_DATE_STRING);
	const max = ensureDateString(props.max, MAX_DATE_STRING);
	const disabledDays = new Set(ensureArray(props.disabledDays));
	const disabledDates = new Set(ensureArray(props.disabledDates));
	const controlledValue = ensureDateStringOrUndefined(props.value);

	const isControlled = hasKey(props, "value");
	const [uncontrolledValue, setUncontrolled] = useState(() =>
		ensureDateStringOrUndefined(props.defaultValue),
	);
	const effectiveValue = isControlled ? controlledValue : uncontrolledValue;

	const days = useMemo(
		() => getNormalizedDaysOfMonth(year, month, weekStartDay),
		[year, month, weekStartDay],
	);

	const onClick = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			const dateString = (event.target as HTMLButtonElement).dataset.value as
				| DateString
				| undefined;

			if (!dateString) {
				return;
			}
			!isControlled && setUncontrolled(dateString);
			onChange(dateString);
		},
		[onChange],
	);

	return (
		<div className={classname(style.wrapper, className)}>
			<WeekHeader format={dayNameFormat} locale={locale} start={weekStartDay} />
			<div className={style.days}>
				{days.map((day) => {
					const isAnotherMonth = day.month !== month || day.year !== year;
					const dateString = day.isoString;
					const isDisabled =
						isAnotherMonth ||
						disabled ||
						disabledDates.has(dateString) ||
						disabledDays.has(day.day) ||
						dateString < min ||
						dateString > max;

					const className = classname([
						dateString === today.isoString && style.today,
						dateString === effectiveValue && style.selected,
					]);

					return (
						<StockButton
							key={dateString}
							data-value={dateString}
							className={className}
							disabled={isDisabled}
							onClick={isAnotherMonth ? undefined : onClick}
						>
							{day.date}
						</StockButton>
					);
				})}
			</div>
		</div>
	);
}

export { Month };
export type { MonthProps };
