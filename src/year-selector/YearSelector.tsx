import { Button } from "../button/Button";
import { getDecade, getToday } from "../util/date";
import style from "./YearSelector.module.css";

type YearSelectorProps = {
	decade?: number;
	value?: number;
	min?: number;
	max?: number;
	onSelect: (year: number) => void;
};

function YearSelector(props: YearSelectorProps) {
	const { year: currentYear } = getToday();
	const { decade = currentYear, value, min = 0, max = 9999, onSelect } = props;

	return (
		<div className={style.wrapper}>
			{getDecade(decade, 5).map((year) => {
				const className = [
					year === value && style.selected,
					year === currentYear && style.current,
				]
					.filter(Boolean)
					.join(" ");
				const disabled = year < min || year > max;

				return (
					<Button
						key={year}
						className={className}
						disabled={disabled}
						onClick={disabled ? undefined : () => onSelect(year)}
					>
						{year}
					</Button>
				);
			})}
		</div>
	);
}

export { YearSelector };
