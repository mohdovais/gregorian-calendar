import { createRoute } from "@tanstack/react-router";
import { ListboxItem } from "framework/listbox/ListboxItem";
import { SearchableListbox } from "framework/listbox/SearchableListbox";
import { useDeferredValue, useMemo, useState } from "react";
import { rootRoute } from "./root";

type Country = { name: string; code: string };

type SearchableListboxPageProps = {
	data: Country[];
};

function SearchableListboxPage(props: SearchableListboxPageProps) {
	const countries = props.data;
	const [query, setQuery] = useState("");
	const deferredQuery = useDeferredValue(query);
	const filtered = useMemo(() => {
		const q = deferredQuery.toLocaleLowerCase();
		return deferredQuery === ""
			? countries
			: countries.filter((c) => c.name.toLocaleLowerCase().includes(q));
	}, [countries, deferredQuery]);

	return (
		<div>
			<h1>SearchableListbox</h1>
			<SearchableListbox onSearch={setQuery}>
				{filtered.map((country) => (
					<ListboxItem key={country.code} value={country.code}>
						{country.name}
					</ListboxItem>
				))}
			</SearchableListbox>
		</div>
	);
}

const searchableLisboxRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "searchable-listbox",
	loader: async () => {
		const response = await fetch("/data/countries.json");
		return response.json() as Promise<Country[]>;
	},
	component: () => {
		const data = searchableLisboxRoute.useLoaderData();
		return <SearchableListboxPage data={data} />;
	},
});

export { searchableLisboxRoute };
