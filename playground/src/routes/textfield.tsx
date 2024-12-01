import { createRoute } from "@tanstack/react-router";
import { TextField } from "framework/textfield";
import { rootRoute } from "./root";

function TextFieldPage() {
	return (
		<div style={{ display: "flex", gap: "1em", flexDirection: "column" }}>
			<div style={{ display: "flex", gap: "1em" }}>
				<TextField label="Username" defaultValue="Username" />
				<TextField label="Username" defaultValue="read only field" readOnly />
				<TextField label="Username" defaultValue="disabled field" disabled />
			</div>
			<div>
				<TextField label="Username" style={{ width: "100%" }} />
			</div>
		</div>
	);
}

const textFieldRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "textfield",
	component: TextFieldPage,
});

export { textFieldRoute };
