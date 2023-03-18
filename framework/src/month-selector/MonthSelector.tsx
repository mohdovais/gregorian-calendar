import { Button } from "../button";
import { classname } from "../utils/classname";
import { getMonthNames } from "../utils/date";
import style from "./MonthSelector.module.css";

type MonthSelectorProps = {
	value?: number;
	year?: number;
	locale?: string;
	onChange: (month: number) => void;
};

function MonthSelector(props: MonthSelectorProps) {
	const today = new Date();
	const currentMonth = today.getMonth();
	const currentYear = today.getFullYear();
	const { locale, value, year = currentYear, onChange } = props;
	const months = getMonthNames("long", locale);

	return (
		<div className={style.wrapper}>
			{months.map((month, i) => (
				<Button
					key={month}
					role="option"
					aria-selected={i === value || undefined}
					className={classname(
						style.btn,
						i === value && style.selected,
						i === currentMonth && year === currentYear && style.current,
					)}
					onClick={() => onChange(i)}
				>
					{month}
				</Button>
			))}
		</div>
	);
}

export { MonthSelector };
export type { MonthSelectorProps };
