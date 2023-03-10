import { Button } from "../button";
import { getMonthNames } from "../util/date";
import style from "./CalendarHeader.module.css";
import {
	ACTION_TYPE_CHANGE_VIEW,
	ACTION_TYPE_NEXT,
	ACTION_TYPE_PREV,
	CAL_VIEW_DATE_SELECTOR,
	CAL_VIEW_MONTH_SELECTOR,
	CAL_VIEW_YEAR_SELECTOR,
	CalendarAction,
	CalendarView,
} from "./store";

type CalendarHeaderProps = {
	year: number;
	month: number;
	view: CalendarView;
	locale?: string;
	dispatch: React.Dispatch<CalendarAction>;
};

function CalendarHeader(props: CalendarHeaderProps) {
	const { month, year, view, locale, dispatch } = props;

	const label =
		view === CAL_VIEW_DATE_SELECTOR
			? `${getMonthNames("long", locale)[month]} ${year}`
			: view === CAL_VIEW_MONTH_SELECTOR
			? year
			: "Select";

	return (
		<div className={style.wrapper}>
			<Button
				disabled={view === CAL_VIEW_MONTH_SELECTOR}
				title="Previous"
				onClick={() => dispatch({ type: ACTION_TYPE_PREV })}
			>
				<svg
					focusable="false"
					aria-hidden="true"
					role="img"
					width={16}
					height={16}
				>
					<path d="M9.605 13.843L3.55 8l6.056-5.84A1.248 1.248 0 1 0 7.876.363L.882 7.1a1.243 1.243 0 0 0 .003 1.797l6.988 6.742a1.248 1.248 0 1 0 1.732-1.796z" />
				</svg>
			</Button>
			<Button
				className={style.title}
				disabled={view === CAL_VIEW_YEAR_SELECTOR}
				onClick={() => dispatch({ type: ACTION_TYPE_CHANGE_VIEW })}
			>
				{label}
			</Button>
			<Button
				disabled={view === CAL_VIEW_MONTH_SELECTOR}
				title="Next"
				onClick={() => dispatch({ type: ACTION_TYPE_NEXT })}
			>
				<svg
					focusable="false"
					aria-hidden="true"
					role="img"
					width={16}
					height={16}
				>
					<path d="M11.5 8a1.241 1.241 0 0 0-.386-.897L4.128.36a1.248 1.248 0 1 0-1.733 1.797L8.45 8l-6.058 5.84a1.248 1.248 0 1 0 1.733 1.797L11.117 8.9A1.245 1.245 0 0 0 11.5 8z" />
				</svg>
			</Button>
		</div>
	);
}

export { CalendarHeader };
export type { CalendarHeaderProps };
