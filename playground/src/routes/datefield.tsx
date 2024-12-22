import { createRoute } from "@tanstack/react-router";
import { DateField } from "framework/datefield";
import { useState } from "react";
import { rootRoute } from "./root";
import { Button } from "framework/button";
import { Toolbar } from "framework/toolbar";

function DateFieldPage() {
	const [value, setValue] = useState<string | undefined>(undefined);
	return (
		<form>
			<Toolbar>
				<DateField
					name="start_date"
					label="Start Date"
					dateFormat="d.m.Y"
					placeholder="DD.MM.YYYY"
					required
					value={value}
					onChange={setValue}
				/>
				<Button type="submit">Submit</Button>
			</Toolbar>
		</form>
	);
}

const dateFieldRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "datefield",
	component: DateFieldPage,
});

export { dateFieldRoute };
