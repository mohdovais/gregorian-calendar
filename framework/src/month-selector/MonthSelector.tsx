import { Button } from "../button";
import { getMonthNames } from "../util/date";
import style from "./MonthSelector.module.css";

type MonthSelectorProps = {
	value?: number;
	year?: number;
	locale?: string;
	onSelect: (month: number) => void;
};

function MonthSelector(props: MonthSelectorProps) {
	const today = new Date();
	const currentMonth = today.getMonth();
	const currentYear = today.getFullYear();
	const { locale, value, year, onSelect } = props;
	const months = getMonthNames("long", locale);

	return (
		<div className={style.wrapper}>
			{months.map((month, i) => (
				<Button
					key={month}
					role="option"
					aria-selected={i === value || undefined}
					className={
						(i === value ? style.selected : "") +
						" " +
						(i === currentMonth && year === currentYear ? style.current : "")
					}
					onClick={() => onSelect(i)}
				>
					{month}
				</Button>
			))}
		</div>
	);
}

export { MonthSelector };
export type { MonthSelectorProps };
