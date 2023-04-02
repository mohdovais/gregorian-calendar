import { Button } from "../../framework/src/button";
import { DateField } from "../../framework/src/datefield";
import { MaskedField } from "../../framework/src/maskedfield";
import { MenuButton } from "../../framework/src/menu-button";
import { Listbox } from "../../framework/src/listbox";
import { isValidDateString } from "../../framework/src/utils/date";
import { useState } from "react";
import menu from "../data/menu.json";
const sunday = [0, 6];
const disabledDates = ["2023-01-26", "2023-08-15"];

const customValidity = (str: string) => {
	return str === "" ? "" : isValidDateString(str) ? "" : "incorrect date";
};

function App() {
	const [value, setValue] = useState<string | undefined>("2023-01-01");
	const [v1, setV1] = useState("orange");
	const [multipleValues, setMultipleValues] = useState<string[]>([]);
	return (
		<form>
			<br />
			<DateField
				name="dob"
				value={value}
				onChange={setValue}
				max='2023-12-31'
				disabledDates={disabledDates}
				disabledDays={sunday}
				size={10}
			/>
			<MaskedField
				name="masked"
				pattern="####-##-##"
				placeholder="yyyy-mm-dd"
				value={value}
				onChange={setValue}
				customValidity={customValidity}
				size={10}
			/>
			<Button type="submit">Submit</Button>
			<br />
			<Listbox
				multiple={true}
				items={menu}
				selection={multipleValues}
				onSelect={setMultipleValues}
			/>
			<Listbox items={menu} selection={v1} onSelect={setV1} />
			<MenuButton items={menu} onSelect={(menu) => console.log(menu)}>
				File
			</MenuButton>
		</form>
	);
}

export { App };
