import { createRouter } from "@tanstack/react-router";
import { comboboxRoute } from "./routes/combobox";
import { dateFieldRoute } from "./routes/datefield";
import { dropdownRoute } from "./routes/dropdown";
import { listboxRoute } from "./routes/listbox";
import { maskedFieldRoute } from "./routes/masked-field";
import { menuButtonRoute } from "./routes/menu-button";
import { rootRoute } from "./routes/root";
import { searchableLisboxRoute } from "./routes/searchable-listbox";
import { textFieldRoute } from "./routes/textfield";
import { tabsRoute } from "./routes/tabs";

const routeTree = rootRoute.addChildren([
	tabsRoute,
	textFieldRoute,
	dropdownRoute,
	comboboxRoute,
	dateFieldRoute,
	listboxRoute,
	maskedFieldRoute,
	menuButtonRoute,
	searchableLisboxRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

export { router };
