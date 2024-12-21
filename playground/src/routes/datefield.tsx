import { createRoute } from "@tanstack/react-router";
import { DateField } from "framework/datefield";
import { useState } from "react";
import { rootRoute } from "./root";
import { Calendar } from "framework/calendar";

const weekends = [0, 6];
const disabledDates = ["2024-12-25", "2024-12-26"];

function DateFieldPage() {
	const [value, setValue] = useState<string | undefined>("2024-12-27");

	console.log("value", value);

	return (
		<div>
			<DateField
				label="Start Date"
				value={value}
				onChange={setValue}
				dateFormat="d.m.Y"
				placeholder="DD.MM.YYYY"
			/>
			<Calendar
				key={value}
				weekStartDay={0}
				disabledDates={disabledDates}
				value={value}
				onChange={setValue}
			/>
		</div>
	);
}

const dateFieldRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "datefield",
	component: DateFieldPage,
});

export { dateFieldRoute };
