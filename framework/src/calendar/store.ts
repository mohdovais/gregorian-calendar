import {
	DateParts,
	getToday,
	increaseMonth,
	parseISODateStringToTDate,
} from "../util/date";
import { copy } from "../util/object";

const CAL_VIEW_DATE_SELECTOR = "month";
const CAL_VIEW_MONTH_SELECTOR = "year";
const CAL_VIEW_YEAR_SELECTOR = "years";
const ACTION_TYPE_NEXT = "N";
const ACTION_TYPE_PREV = "P";
const ACTION_TYPE_CHANGE_VIEW = "V";
const ACTION_TYPE_SELECT_YEAR = "SY";
const ACTION_TYPE_SELECT_MONTH = "SM";
const ACTION_TYPE_SELECT_DATE = "SD";

type CalendarView =
	| typeof CAL_VIEW_DATE_SELECTOR
	| typeof CAL_VIEW_MONTH_SELECTOR
	| typeof CAL_VIEW_YEAR_SELECTOR;

type CalendarState = {
	viewType: CalendarView;
	currentYear: number;
	currentMonth: number;
};

type InitializerArg = {
	value?: string;
};

type ActionNext = { type: typeof ACTION_TYPE_NEXT };
type ActionPrev = { type: typeof ACTION_TYPE_PREV };
type ActionView = { type: typeof ACTION_TYPE_CHANGE_VIEW };
type ActionSelectYear = { type: typeof ACTION_TYPE_SELECT_YEAR; year: number };
type ActionSelectMonth = {
	type: typeof ACTION_TYPE_SELECT_MONTH;
	month: number;
};
type ActionSelectDate = {
	type: typeof ACTION_TYPE_SELECT_DATE;
	date: DateParts;
};

type CalendarAction =
	| ActionNext
	| ActionPrev
	| ActionView
	| ActionSelectYear
	| ActionSelectMonth
	| ActionSelectDate;

function calendarInitializer(initializerArg: InitializerArg): CalendarState {
	let parsedDate = parseISODateStringToTDate(initializerArg.value);

	if (parsedDate == null) {
		parsedDate = getToday();
	}

	return {
		viewType: CAL_VIEW_DATE_SELECTOR,
		currentYear: parsedDate.year,
		currentMonth: parsedDate.month,
	};
}

function calendarReducer(
	state: CalendarState,
	action: CalendarAction,
): CalendarState {
	const { currentMonth, currentYear } = state;
	switch (action.type) {
		case ACTION_TYPE_NEXT: {
			if (state.viewType === CAL_VIEW_DATE_SELECTOR) {
				const { month, year } = increaseMonth(currentYear, currentMonth, 1);
				return copy(state, {
					currentMonth: month,
					currentYear: year,
				});
			}
			if (state.viewType === CAL_VIEW_YEAR_SELECTOR) {
				return copy(state, {
					currentYear: Math.min(9999, state.currentYear + 10),
				});
			}

			break;
		}
		case ACTION_TYPE_PREV: {
			if (state.viewType === CAL_VIEW_DATE_SELECTOR) {
				const { month, year } = increaseMonth(currentYear, currentMonth, -1);
				return copy(state, {
					currentMonth: month,
					currentYear: year,
				});
			}

			if (state.viewType === CAL_VIEW_YEAR_SELECTOR) {
				return copy(state, {
					currentYear: Math.max(0, state.currentYear - 10),
				});
			}

			break;
		}

		case ACTION_TYPE_CHANGE_VIEW: {
			const { viewType } = state;
			return copy(state, {
				viewType:
					viewType === CAL_VIEW_DATE_SELECTOR
						? CAL_VIEW_MONTH_SELECTOR
						: viewType === CAL_VIEW_MONTH_SELECTOR
						? CAL_VIEW_YEAR_SELECTOR
						: viewType,
			});
		}

		case ACTION_TYPE_SELECT_YEAR: {
			return copy(state, {
				currentYear: action.year,
				viewType: CAL_VIEW_MONTH_SELECTOR,
			});
		}

		case ACTION_TYPE_SELECT_MONTH: {
			return copy(state, {
				currentMonth: action.month,
				viewType: CAL_VIEW_DATE_SELECTOR,
			});
		}

		case ACTION_TYPE_SELECT_DATE: {
			return copy(state, {});
		}
	}
	return state;
}

export {
	calendarReducer,
	calendarInitializer,
	ACTION_TYPE_NEXT,
	ACTION_TYPE_PREV,
	ACTION_TYPE_CHANGE_VIEW,
	ACTION_TYPE_SELECT_DATE,
	ACTION_TYPE_SELECT_MONTH,
	ACTION_TYPE_SELECT_YEAR,
	CAL_VIEW_DATE_SELECTOR,
	CAL_VIEW_MONTH_SELECTOR,
	CAL_VIEW_YEAR_SELECTOR,
};

export type { CalendarAction, CalendarState, CalendarView };
