import { useReducer } from "react";
import { Month, MonthProps } from "../month";
import { MonthSelector } from "../month/month-selector";

import { DateString } from "../utils/date";
import { emptyFn } from "../utils/function";
import { YearSelector } from "../year-selector";
import style from "./calendar.module.css";
import { CalendarHeader } from "./calendar-header";
import {
	ACTION_TYPE_SELECT_MONTH,
	ACTION_TYPE_SELECT_YEAR,
	CAL_VIEW_DATE_SELECTOR,
	CAL_VIEW_MONTH_SELECTOR,
	CAL_VIEW_YEAR_SELECTOR,
	calendarInitializer,
	calendarReducer,
} from "./calendar.store";
import { classNames } from "../utils/string";

type ReactDiv = React.DetailedHTMLProps<
	React.HTMLAttributes<HTMLDivElement>,
	HTMLDivElement
>;

interface CalendarProps extends Omit<ReactDiv, "onChange"> {
	value?: string;
	min?: string;
	max?: string;
	locale?: string;
	weekStartDay?: MonthProps["weekStartDay"];
	disabledDates?: MonthProps["disabledDates"];
	disabledDays?: MonthProps["disabledDays"];
	dayNameFormat?: MonthProps["dayNameFormat"];
	onChange?: (date: DateString) => void;
}

function Calendar(props: CalendarProps) {
	const {
		className,
		locale,
		value,
		weekStartDay,
		dayNameFormat,
		disabledDates,
		disabledDays,
		max,
		min,
		onChange = emptyFn as CalendarProps["onChange"],
		...divProps
	} = props;

	const [state, dispatch] = useReducer(
		calendarReducer,
		{ value },
		calendarInitializer,
	);
	const { currentMonth, currentYear, viewType } = state;
	let view;

	switch (viewType) {
		case CAL_VIEW_DATE_SELECTOR:
			view = (
				<Month
					year={currentYear}
					month={currentMonth}
					value={value}
					max={max}
					min={min}
					weekStartDay={weekStartDay}
					dayNameFormat={dayNameFormat}
					disabledDates={disabledDates}
					disabledDays={disabledDays}
					locale={locale}
					onChange={onChange}
				/>
			);
			break;
		case CAL_VIEW_MONTH_SELECTOR:
			view = (
				<MonthSelector
					locale={locale}
					year={currentYear}
					value={currentMonth}
					onChange={(month) =>
						dispatch({ type: ACTION_TYPE_SELECT_MONTH, month })}
				/>
			);
			break;
		case CAL_VIEW_YEAR_SELECTOR:
			view = (
				<YearSelector
					decade={currentYear}
					value={currentYear}
					onSelect={(year) =>
						dispatch({ type: ACTION_TYPE_SELECT_YEAR, year })}
				/>
			);
			break;
	}

	return (
		<div
			{...divProps}
			className={classNames(style.calander, className)}
			data-name="calendar"
		>
			<CalendarHeader
				year={currentYear}
				month={currentMonth}
				view={viewType}
				dispatch={dispatch}
				locale={locale}
			/>
			<div>{view}</div>
		</div>
	);
}

export { Calendar };
export type { CalendarProps };
