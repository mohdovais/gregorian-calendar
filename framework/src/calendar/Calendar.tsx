import { Month, MonthProps } from "../month";
import { MonthSelector } from "../month-selector";
import { classname } from "../utils/classname";
import { DateString } from "../utils/date";
import { noop } from "../utils/function";
import { YearSelector } from "../year-selector";
import { CalendarHeader } from "./CalendarHeader";
import style from "./index.module.css";
import {
	ACTION_TYPE_SELECT_MONTH,
	ACTION_TYPE_SELECT_YEAR,
	CAL_VIEW_DATE_SELECTOR,
	CAL_VIEW_MONTH_SELECTOR,
	CAL_VIEW_YEAR_SELECTOR,
	calendarInitializer,
	calendarReducer,
} from "./store";
import { forwardRef, useReducer } from "react";

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

function Calendar(props: CalendarProps, ref?: React.Ref<HTMLDivElement>) {
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
		onChange = noop as CalendarProps["onChange"],
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
						dispatch({ type: ACTION_TYPE_SELECT_MONTH, month })
					}
				/>
			);
			break;
		case CAL_VIEW_YEAR_SELECTOR:
			view = (
				<YearSelector
					decade={currentYear}
					value={currentYear}
					onSelect={(year) => dispatch({ type: ACTION_TYPE_SELECT_YEAR, year })}
				/>
			);
			break;
	}

	return (
		<div
			{...divProps}
			className={classname(style.wrapper, className)}
			data-name="calendar"
			ref={ref}
		>
			<CalendarHeader
				year={currentYear}
				month={currentMonth}
				view={viewType}
				dispatch={dispatch}
				locale={locale}
			/>
			{view}
		</div>
	);
}

const forwardedRefCalendar = forwardRef(Calendar) as typeof Calendar;

export { forwardedRefCalendar as Calendar };
export type { CalendarProps };
