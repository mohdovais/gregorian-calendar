import { DateField } from "../../framework/src/datefield";
import { Calendar } from "framework/calendar";
import { useState } from "react";
const weekends = [0, 6];
const disabledDates = ["2023-01-26", "2023-08-15"];
function App() {
	const [value, setValue] = useState("2023-01-01");
	return (
		<div style={{ display: "inline-flex", flexDirection: "column" }}>
			<Calendar value={value} onChange={setValue} disabledDays={weekends} />
			{value}
			<Calendar value={value} onChange={setValue} />
			<br />
			<DateField value={value} locale="en-US" />
		</div>
	);
}

export { App };
