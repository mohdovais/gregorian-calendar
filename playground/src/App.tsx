import { Button } from "../../framework/src/button";
import { DateField } from "../../framework/src/datefield";
import { Listbox } from "../../framework/src/listbox";
import { MaskedField } from "../../framework/src/maskedfield";
import { Menu } from "../../framework/src/menu";
import { MenuButton } from "../../framework/src/menu-button";
import { isValidDateString } from "../../framework/src/utils/date";
import menu from "../data/menu.json";
import { useState } from "react";
const sunday = [0, 6];
const disabledDates = ["2023-01-26", "2023-08-15"];

const customValidity = (str: string) => {
	return str === "" ? "" : isValidDateString(str) ? "" : "incorrect date";
};

function App() {
	const [value, setValue] = useState<string | undefined>("2023-01-01");
	const [v1, setV1] = useState("orange");
	const [multipleValues, setMultipleValues] = useState<string[]>(["clean-by"]);
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
			<MenuButton items={menu} onSelect={console.log}>
				Menu
			</MenuButton>
			<br />
		</form>
	);
}

export { App };
