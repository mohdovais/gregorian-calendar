import { createRoute } from "@tanstack/react-router";
import { DateField } from "framework/datefield";
import { useState } from "react";
import { rootRoute } from "./root";

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
		</div>
	);
}

const dateFieldRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "datefield",
	component: DateFieldPage,
});

export { dateFieldRoute };
