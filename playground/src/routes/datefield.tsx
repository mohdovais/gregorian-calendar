import { useState } from "react";
import { DateField } from "../../../framework/src/datefield/DateField";

const weekends = [0, 6];
const disabledDates = ["2023-12-25", "2023-12-26"];

function DateFieldPage() {
	const [value, setValue] = useState<string | undefined>("2024-01-01");

	return (
		<DateField
			name="dob"
			value={value}
			onChange={setValue}
			max="2024-12-31"
			disabledDates={disabledDates}
			disabledDays={weekends}
			size={10}
		/>
	);
}

export { DateFieldPage as Component };
