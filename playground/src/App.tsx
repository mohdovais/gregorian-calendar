import { MonthRange } from "framework/month";

const weekends = [0, 6];
const disabledDates = ["2023-01-26", "2023-08-15"];

function App() {
	return (
		<div style={{ display: "inline-block" }}>
			<MonthRange onChange={console.log} />
		</div>
	);
}

export { App };
