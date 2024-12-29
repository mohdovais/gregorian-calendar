import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import { CheckboxGroup } from "framework/checkbox/checkbox-group";

function CheckboxPage() {
	return (
		<div>
			<CheckboxGroup
				name="a"
				legend="Combine <fieldset> with the <legend> tag to provide a caption or title for the group."
			>
				<CheckboxGroup.Item label="Yes" value="1" />
				<CheckboxGroup.Item label="No" value="0" />
				<CheckboxGroup.Item label="May be" value="2" />
			</CheckboxGroup>

			<CheckboxGroup
				name="b"
				legend="Combine <fieldset> with the <legend> tag to provide a caption or title for the group."
				horizontal
			>
				<CheckboxGroup.Item label="Yes" value="1" />
				<CheckboxGroup.Item label="No" value="0" />
				<CheckboxGroup.Item label="May be" value="2" />
			</CheckboxGroup>
		</div>
	);
}

const checkboxRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "checkbox",
	component: CheckboxPage,
});

export { checkboxRoute };
