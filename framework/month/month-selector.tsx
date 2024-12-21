import { BaseButton } from "../button/base-button";

import { getMonthNames } from "../utils/date";
import { classNames } from "../utils/string";
import style from "./month-selector.module.css";

type MonthSelectorProps = {
	value?: number;
	year?: number;
	locale?: string;
	onChange: (month: number, year: number) => void;
};

function MonthSelector(props: MonthSelectorProps) {
	const today = new Date();
	const currentMonth = today.getMonth();
	const currentYear = today.getFullYear();
	const { locale, value, year = currentYear, onChange } = props;
	const months = getMonthNames("short", locale);

	return (
		<div className={style.wrapper}>
			{months.map((month, i) => (
				<BaseButton
					key={month}
					role="option"
					aria-selected={i === value || undefined}
					className={classNames(
						style.btn,
						i === value && style.selected,
						i === currentMonth && year === currentYear &&
							style.current,
					)}
					onClick={() => onChange(i, year)}
				>
					{month}
				</BaseButton>
			))}
		</div>
	);
}

export { MonthSelector };
export type { MonthSelectorProps };
