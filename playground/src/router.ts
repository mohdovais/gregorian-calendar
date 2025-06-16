import { createRouter } from "@tanstack/react-router";
import { dateFieldRoute } from "./routes/datefield";
import { dropdownRoute } from "./routes/dropdown";
import { rootRoute } from "./routes/root";
import { textFieldRoute } from "./routes/textfield";
import { tabsRoute } from "./routes/tabs";
import { tableRoute } from "./routes/table.route";
import { checkboxRoute } from "./routes/checkbox";
import { radioRoute } from "./routes/radio";
import { indexRoute } from "./routes/index.route";
import { menuButtonRoute } from "./routes/menu-button";
import { rangeSliderRoute } from "./routes/range-slider/route";

const routeTree = rootRoute.addChildren([
	indexRoute,
	radioRoute,
	checkboxRoute,
	tableRoute,
	tabsRoute,
	textFieldRoute,
	dropdownRoute,
	menuButtonRoute,
	dateFieldRoute,
	rangeSliderRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

export { router };
