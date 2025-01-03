import { BaseButton } from "../base-button";
import { ensureArray } from "../utils/array";

import {
	DateString,
	DAYS_IN_MONTH,
	ensureDateString,
	MAX_DATE_STRING,
	MIN_DATE_STRING,
} from "../utils/date";
import { bound } from "../utils/number";
import { ensureNotNullOrUndefined } from "../utils/object";
import { WeekHeader, WeekHeaderProps } from "./week-header";

import style from "./month.module.css";
import { classNames } from "../utils/string";

interface MonthProps {
	className?: string;
	value?: string; //DateString;
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
	const now = new Date();
	const {
		className,
		dayNameFormat,
		disabled,
		locale,
		onChange,
		value,
	} = props;

	// props validations
	const year = bound(
		ensureNotNullOrUndefined(props.year, now.getFullYear()) | 0,
		0,
		9999,
	);
	const month = bound(
		ensureNotNullOrUndefined(props.month, now.getMonth()) | 0,
		0,
		11,
	);
	const weekStartDay = bound(
		ensureNotNullOrUndefined(props.weekStartDay, 1) | 0,
		0,
		6,
	);
	const min = ensureDateString(props.min, MIN_DATE_STRING);
	const max = ensureDateString(props.max, MAX_DATE_STRING);
	const disabledDays = new Set(ensureArray(props.disabledDays));
	const disabledDates = new Set(ensureArray(props.disabledDates));
	const isoNow = now.toISOString().slice(0, 10);
	const hasCallback = typeof onChange === "function";

	return (
		<div className={classNames(style.wrapper, className)}>
			<WeekHeader
				format={dayNameFormat}
				locale={locale}
				start={weekStartDay}
			/>
			<div className={style.days}>
				{getDaysOfMonth(year, month, weekStartDay).map(
					(wtf, i) => {
						if (wtf == null) {
							return <BaseButton key={i} disabled />;
						}

						const { date, dateString, day } = wtf;

						const isDisabled = disabled ||
							disabledDays.has(day) ||
							disabledDates.has(dateString) ||
							dateString < min ||
							dateString > max;

						const className = classNames(
							isoNow === dateString &&
								style.today,
							dateString === value && style.selected,
						);

						return (
							<BaseButton
								key={dateString}
								className={className}
								disabled={isDisabled}
								onClick={hasCallback && !isDisabled
									? () => onChange(dateString)
									: undefined}
							>
								{date}
							</BaseButton>
						);
					},
				)}
			</div>
		</div>
	);
}

function twoDigits(value: number) {
	return value < 10 ? `0${value}` : value.toString();
}

type DayOfMonth = {
	date: number;
	day: number;
	dateString: DateString;
};

function getDaysOfMonth(
	year: number,
	month: number,
	weekStartDay = 1,
	padding = 42,
) {
	const daysInMonth = month === 1 && year % 4 === 0
		? 29
		: DAYS_IN_MONTH[month];
	const firstDayOfMonth = new Date(year, month, 1).getDay();

	weekStartDay = bound(weekStartDay | 0, 0, 6);

	const prefixCount = (7 - weekStartDay + firstDayOfMonth) % 7;
	const suffixCount = padding - prefixCount - daysInMonth;
	const items: (DayOfMonth | null)[] = [];

	for (let i = 0; i < prefixCount; i++) {
		items.push(null);
	}

	const mm = twoDigits(month + 1);

	for (let i = 0; i < daysInMonth; i++) {
		items.push({
			date: i + 1,
			day: (firstDayOfMonth + i) % 7,
			dateString: `${year}-${mm}-${twoDigits(i + 1)}` as DateString,
		});
	}

	for (let i = 0; i < suffixCount; i++) {
		items.push(null);
	}

	return items;
}

export { Month };
export type { MonthProps };
