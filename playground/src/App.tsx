import { Button } from "../../framework/src/button";
import { DateField } from "../../framework/src/datefield";
import { MaskedField } from "../../framework/src/maskedfield";
import { useState } from "react";
const weekends = [0, 6];
const disabledDates = ["2023-01-26", "2023-08-15"];
function App() {
	const [value, setValue] = useState<string | undefined>("2023-01-01");
	return (
		<form>
			<br />
			<DateField
				name="dob"
				value={value}
				onChange={setValue}
				max='2023-01-05'
				size={10}
			/>
			<MaskedField
				pattern="####-##-##"
				placeholder="yyyy-mm-dd"
				value={value}
				onChange={setValue}
			/>
			<Button type="submit">Submit</Button>
			<br />
		</form>
	);
}

export { App };
