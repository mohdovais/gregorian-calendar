import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import { CheckboxGroup } from "framework/checkbox-group";

function CheckboxPage() {
	return (
		<div>
			<CheckboxGroup
				name="a"
				legend="Combine <fieldset> with the <legend> tag to provide a caption or title for the group."
				value={["0", "1"]}
			>
				<CheckboxGroup.Item label="Yes" value="1" />
				<CheckboxGroup.Item label="No" value="0" />
				<CheckboxGroup.Item label="May be" value="2" />
			</CheckboxGroup>
			<h5>Horizontal</h5>
			<CheckboxGroup
				name="b"
				legend="Combine <fieldset> with the <legend> tag to provide a caption or title for the group."
				horizontal
			>
				<CheckboxGroup.Item label="Yes" value="1" />
				<CheckboxGroup.Item label="No" value="0" />
				<CheckboxGroup.Item label="May be" value="2" />
			</CheckboxGroup>
			<h5>Disabled</h5>
			<CheckboxGroup
				name="c"
				legend="Combine <fieldset> with the <legend> tag to provide a caption or title for the group."
				horizontal
			>
				<CheckboxGroup.Item label="Yes" value="1" />
				<CheckboxGroup.Item label="No" value="0" />
				<CheckboxGroup.Item label="May be" value="2" disabled />
			</CheckboxGroup>
			<h5>Disabled All</h5>
			<CheckboxGroup
				name="c"
				legend="Combine <fieldset> with the <legend> tag to provide a caption or title for the group."
				horizontal
				disabled
				value="0"
			>
				<CheckboxGroup.Item label="Yes" value="1" />
				<CheckboxGroup.Item label="No" value="0" />
				<CheckboxGroup.Item label="May be" value="2" />
			</CheckboxGroup>
			<h5>Required</h5>
			<CheckboxGroup
				name="c"
				legend="Combine <fieldset> with the <legend> tag to provide a caption or title for the group."
				horizontal
			>
				<CheckboxGroup.Item label="Yes" value="1" required />
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
