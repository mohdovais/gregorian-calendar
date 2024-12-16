import { createRoute } from "@tanstack/react-router";
import { DateField } from "framework2/datefield";
import { useState } from "react";
import { rootRoute } from "./root";

const weekends = [0, 6];
const disabledDates = ["2023-12-25", "2023-12-26"];

function DateFieldPage() {
	const [value, setValue] = useState<string | undefined>("2024-12-25");

	return (
		<div>
			<DateField
				label="Start Date"
				value={value}
				onChange={setValue}
				dateFormat="d.m.Y"
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
