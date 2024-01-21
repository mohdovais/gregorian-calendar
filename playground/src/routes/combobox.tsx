import { useLoaderData } from "react-router-dom";
import { Combobox } from "../../../framework/src/combobox";
import { Input } from "../../../framework/src/input";
import { ListboxItem } from "../../../framework/src/listbox/ListboxItem";

function loader() {
	return import("../../data/countries.json").then((module) => module.default);
}

function ComboboxPage() {
	const data = useLoaderData() as Awaited<ReturnType<typeof loader>>;
	return (
		<>
			<Combobox>
				{data.map((c) => (
					<ListboxItem key={c.code} value={c.code}>
						{c.name}
					</ListboxItem>
				))}
			</Combobox>
			<Input />
		</>
	);
}

export { ComboboxPage as Component, loader };
