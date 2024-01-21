import { Listbox } from "../../../framework/src/listbox/Listbox";
import { ListboxGroup } from "../../../framework/src/listbox/ListboxGroup";
import { ListboxItem } from "../../../framework/src/listbox/ListboxItem";

function ListboxPage() {
	return (
		<Listbox value="b" onChange={console.log}>
			<ListboxGroup label="Alphabets">
				<ListboxItem value="a">A</ListboxItem>
				<ListboxItem value="b">B</ListboxItem>
				<ListboxItem value="c">C</ListboxItem>
			</ListboxGroup>
		</Listbox>
	);
}

export { ListboxPage as Component };
