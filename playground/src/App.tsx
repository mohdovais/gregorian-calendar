import { DateField } from "framework/datefield";
import { useState } from "react";
const weekends = [0, 6];
const disabledDates = ["2023-01-26", "2023-08-15"];
function App() {
	const [value, setValue] = useState<string | undefined>("2023-01-01");
	return (
		<form style={{ display: "inline-flex", flexDirection: "column" }}>
			<br />
			<DateField
				name="dob"
				value={value}
				max='2023-01-05'
				onChange={setValue}
			/>
			<br />
			<button type="submit">Submit</button>
		</form>
	);
}

export { App };
