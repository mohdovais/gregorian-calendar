import { BaseButton } from "../base-button";
import { classNames } from "../utils/string";

import style from "./year-selector.module.css";

function getDecade(year: number) {
	const start = Math.max(0, Math.floor(year / 10) * 10) | 0;
	const years: number[] = [];
	for (let i = 0; i < 12; i++) {
		years.push(start + i);
	}
	return years;
}

type YearSelectorProps = {
	decade?: number;
	value?: number;
	min?: number;
	max?: number;
	onSelect: (year: number) => void;
};

function YearSelector(props: YearSelectorProps) {
	const currentYear = new Date().getFullYear();
	const { decade = currentYear, value, min = 0, max = 9999, onSelect } =
		props;

	return (
		<div className={style.wrapper}>
			{getDecade(decade).map((year) => {
				const className = classNames(
					year === value && style.selected,
					year === currentYear && style.current,
				);

				const disabled = year < min || year > max;

				return (
					<BaseButton
						key={year}
						className={classNames(style.btn, className)}
						disabled={disabled}
						onClick={disabled ? undefined : () => onSelect(year)}
					>
						{year}
					</BaseButton>
				);
			})}
		</div>
	);
}

export { YearSelector };
