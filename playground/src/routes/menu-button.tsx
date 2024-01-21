import { useLoaderData } from "react-router-dom";
import { ListboxItem } from "../../../framework/src/listbox/ListboxItem";
import { MenuButton } from "../../../framework/src/menu-button/MenuButton";

function loader() {
	return import("../../data/menu2.json").then((mod) => mod.default);
}

function MenuButtonPage() {
	const menu = useLoaderData() as Awaited<ReturnType<typeof loader>>;
	return (
		<MenuButton label="File">
			<ListboxItem value="new-tab">New Tab</ListboxItem>
			<ListboxItem value="new-window">New Window</ListboxItem>
		</MenuButton>
	);
}

export { MenuButtonPage as Component, loader };
