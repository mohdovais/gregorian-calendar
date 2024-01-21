import { useDeferredValue, useMemo, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { ListboxItem } from "../../../framework/src/listbox/ListboxItem";
import { SearchableListbox } from "../../../framework/src/listbox/SearchableListbox";

function loader() {
	return import("../../data/countries.json").then((module) => module.default);
}

function SearchableListboxPage() {
	const countries = useLoaderData() as Awaited<ReturnType<typeof loader>>;
	const [query, setQuery] = useState("");
	const deferredQuery = useDeferredValue(query);
	const filtered = useMemo(() => {
		const q = deferredQuery.toLocaleLowerCase();
		return deferredQuery === ""
			? countries
			: countries.filter((c) => c.name.toLocaleLowerCase().includes(q));
	}, [countries, deferredQuery]);

	return (
		<>
			<h1>SearchableListbox</h1>
			<SearchableListbox onSearch={setQuery}>
				{filtered.map((country) => (
					<ListboxItem key={country.code} value={country.code}>
						{country.name}
					</ListboxItem>
				))}
			</SearchableListbox>
		</>
	);
}

export { SearchableListboxPage as Component, loader };
