import { createRoute } from "@tanstack/react-router";
import { TextField } from "framework/textfield";
import css from "./dropdown.module.css";
import { rootRoute } from "./root";

type Country = { name: string; code: string };

type DropdownProps = {
	data: Country[];
};

function Dropdown(props: DropdownProps) {
	return (
		<div>
			<TextField label="Dropdown" className={css.input} />
		</div>
	);
}

const dropdownRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "dropdown",
	loader: async () => {
		const response = await fetch("/data/countries.json");
		return response.json() as Promise<Country[]>;
	},
	component: () => {
		const data = dropdownRoute.useLoaderData();
		return <Dropdown data={data} />;
	},
});

export { dropdownRoute };
