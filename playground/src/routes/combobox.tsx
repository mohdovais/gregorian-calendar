import { createRoute } from "@tanstack/react-router";
import { Combobox } from "framework/combobox";
import { ListboxItem } from "framework/listbox/ListboxItem";
import { rootRoute } from "./root";

type Country = { name: string; code: string };

const comboboxRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "combobox",
	loader: async () => {
		const response = await fetch("/data/countries.json");
		return response.json() as Promise<Country[]>;
	},
	component: () => {
		const data = comboboxRoute.useLoaderData();

		return (
			<Combobox>
				{data.map((c) => (
					<ListboxItem key={c.code} value={c.code}>
						{c.name}
					</ListboxItem>
				))}
			</Combobox>
		);
	},
});

export { comboboxRoute };
