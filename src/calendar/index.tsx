import { Month, MonthProps } from "../month";
import { MonthSelector } from "../month-selector";
import { TDate } from "../util/date";
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

interface CalendarProps extends Omit<ReactDiv, "onSelect"> {
	defaultValue?: string;
	min?: string;
	max?: string;
	locale?: string;
	weekStartDay?: MonthProps["weekStartDay"];
	disabledDates?: MonthProps["disabledDates"];
	disabledDays?: MonthProps["disabledDays"];
	dayNameformat?: MonthProps["dayNameFormat"];
	onSelect?: (date: TDate) => void;
}

function Calendar(props: CalendarProps, ref?: React.Ref<HTMLDivElement>) {
	const {
		locale,
		defaultValue,
		weekStartDay,
		dayNameformat,
		disabledDates,
		disabledDays,
		max,
		min,
		onSelect,
		className = "",
		...divProps
	} = props;

	const [state, dispatch] = useReducer(
		calendarReducer,
		{ defaultValue },
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
					max={max}
					min={min}
					weekStartDay={weekStartDay}
					dayNameFormat={dayNameformat}
					disabledDates={disabledDates}
					disabledDays={disabledDays}
					locale={locale}
					onChange={(date) => typeof onSelect === "function" && onSelect(date)}
				/>
			);
			break;
		case CAL_VIEW_MONTH_SELECTOR:
			view = (
				<MonthSelector
					locale={locale}
					onSelect={(month) =>
						dispatch({ type: ACTION_TYPE_SELECT_MONTH, month })
					}
				/>
			);
			break;
		case CAL_VIEW_YEAR_SELECTOR:
			view = (
				<YearSelector
					decade={currentYear}
					onSelect={(year) => dispatch({ type: ACTION_TYPE_SELECT_YEAR, year })}
				/>
			);
			break;
	}

	return (
		<div
			{...divProps}
			className={style.wrapper + " " + className}
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
