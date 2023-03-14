import { getWeekdayNames } from "../util/date";
import style from "./Header.module.css";
import { memo, useMemo } from "react";

interface WeekHeaderProps {
	locale?: string;
	start?: number;
	format?: "short" | "long" | "narrow";
}

function WeekHeader(props: WeekHeaderProps) {
	const { format = "short", locale, start = 1 } = props;
	const names = useMemo(() => {
		const isNarrow = format === "narrow";
		const days = getWeekdayNames(isNarrow ? "short" : format, locale).map(
			(name) => (isNarrow ? name.substring(0, 2) : name),
		);
		return days.slice(start).concat(days.slice(0, start));
	}, [format, locale, start]);

	return (
		<div className={style.week}>
			{names.map((name) => (
				<div className={style.day} key={name}>
					{name}
				</div>
			))}
		</div>
	);
}

const WeekHeaderMemo = memo(WeekHeader);

export { WeekHeaderMemo as WeekHeader };
export type { WeekHeaderProps };
