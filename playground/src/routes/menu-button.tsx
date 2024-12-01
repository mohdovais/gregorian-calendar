import { createRoute } from "@tanstack/react-router";
import { ListboxItem } from "framework/listbox/ListboxItem";
import { MenuButton } from "framework/menu-button/MenuButton";
import { rootRoute } from "./root";

function MenuButtonPage() {
	return (
		<MenuButton label="File">
			<ListboxItem value="new-tab">New Tab</ListboxItem>
			<ListboxItem value="new-window">New Window</ListboxItem>
		</MenuButton>
	);
}

const menuButtonRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "menu-button",
	loader: () => {},
	component: MenuButtonPage,
});

export { menuButtonRoute };
