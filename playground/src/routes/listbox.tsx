import { createRoute } from "@tanstack/react-router";
import { Listbox } from "framework/listbox/Listbox";
import { ListboxGroup } from "framework/listbox/ListboxGroup";
import { ListboxItem } from "framework/listbox/ListboxItem";
import { rootRoute } from "./root";

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

const listboxRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "listbox",
	component: ListboxPage,
});

export { listboxRoute };
