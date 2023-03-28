import { Button } from "../../framework/src/button";
import { DateField } from "../../framework/src/datefield";
import { Listbox } from "../../framework/src/listbox";
import { MaskedField } from "../../framework/src/maskedfield";
import { Menu, MenuGroupOrItem } from "../../framework/src/menu";
import { OptionList } from "../../framework/src/option-list";
import { isValidDateString } from "../../framework/src/utils/date";
import { useState } from "react";
const sunday = [0, 6];
const disabledDates = ["2023-01-26", "2023-08-15"];
import data from "../data/users.json";

const customValidity = (str: string) => {
	return str === "" ? "" : isValidDateString(str) ? "" : "incorrect date";
};

const listStyle: React.CSSProperties = { height: 200, display: "inline-block" };
const menu: MenuGroupOrItem<string>[] = [
	{
		disabled: true,
		options: [
			{
				label: "as Icons",
				value: "apple",
				keys: "⌘ 1",
			},
			{
				label: "as List",
				value: "apple",
				keys: "⌘ 2",
			},
			{
				label: "as Columns",
				value: "apple",
				keys: "⌘ 3",
			},
			{
				label: "as Gallery",
				value: "apple",
				keys: "⌘ 4",
			},
		],
	},
	{
		options: [
			{
				label: "Use Stacks",
				value: "apple",
				keys: "⌃ ⌘ 0",
			},
			{
				label: "Sort By",
				value: "apple",
				more: [
					{
						label: "hh",
						value: "bb",
					},
				],
			},
			{
				label: "Clean Up",
				value: "apple",
			},
			{
				label: "Clean Up By",
				value: "apple",
				more: [
					{
						label: "hh",
						value: "bb",
					},
				],
			},
		],
	},
	{
		disabled: true,
		options: [
			{
				label: "Hide Sidebar",
				value: "apple",
			},
			{
				label: "Hide Preview",
				value: "apple",
			},
		],
	},
	{
		disabled: true,
		options: [
			{
				label: "Hide Toolbar",
				value: "apple",
			},
			{
				label: "Show All Tabs",
				value: "apple",
			},
		],
	},
	{
		options: [
			{
				label: "Show Preview Options",
				value: "more",
				more: [
					{
						label: "Hide Toolbar",
						value: "apple",
					},
					{
						label: "Show All Tabs",
						value: "apple",
					},
				],
			},
		],
	},
];
const options = [
	{
		label: "Apple",
		value: "apple",
	},
	{
		label: "Banana",
		value: "banana",
	},
	{
		label: "Orange",
		value: "orange",
	},
	{
		options: [
			{
				label: "Apple",
				value: "apple",
			},
			{
				label: "Banana",
				value: "banana",
			},
			{
				label: "Orange",
				value: "orange",
			},
		],
	},
	{
		label: "Vegitables",
		options: [
			{
				label: "Cucumber",
				value: "cucumber",
				disabled: true,
			},
			{
				label: "Cabbage",
				value: "cabbage",
			},
			{
				label: "Onion",
				value: "onion",
			},
		],
	},
	{
		disabled: true,
		options: [
			{
				label: "Cucumber",
				value: "cucumber",
			},
			{
				label: "Cabbage",
				value: "cabbage",
			},
			{
				label: "Onion",
				value: "onion",
			},
		],
	},
	{
		label: "Cucumber",
		value: "cucumber",
	},
];

function App() {
	const [value, setValue] = useState<string | undefined>("2023-01-01");
	const [v1, setV1] = useState("orange");
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
				options={data}
				value={data[5]}
				displayField="first_name"
				style={listStyle}
			/>

			<Button>{v1}</Button>
			<OptionList value={v1} onSelection={setV1} options={options} />
			<Menu items={menu} />
		</form>
	);
}

export { App };
