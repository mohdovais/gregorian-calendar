import { createRoute } from "@tanstack/react-router";
import { DateField } from "framework/datefield";
import { useState } from "react";
import { rootRoute } from "./root";

function DateFieldPage() {
	const [value, setValue] = useState<string | undefined>("2024-12-25");
	return (
		<form>
			<h2>DateField</h2>
			<DateField
				name="date"
				label="Date"
				value={value}
				onChange={setValue}
			/>
			<h5>Locale (Polski)</h5>
			<DateField
				name="data"
				label="Data"
				dateFormat="d.m.Y"
				placeholder="DD.MM.YYYY"
				locale="pl"
				value={value}
				onChange={setValue}
			/>
			<h5>Min date</h5>

			<DateField
				name="min-date"
				label="Date"
				value={value}
				onChange={setValue}
			/>
			<button type="submit">Submit</button>
		</form>
	);
}

const dateFieldRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "datefield",
	component: DateFieldPage,
});

export { dateFieldRoute };
