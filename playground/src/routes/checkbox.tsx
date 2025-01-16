import { createRoute } from "@tanstack/react-router";
import { CheckboxGroup } from "framework/checkbox-group";
import { indexRoute } from "./index.route";

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
				display="inline"
			>
				<CheckboxGroup.Item label="Yes" value="1" />
				<CheckboxGroup.Item label="No" value="0" />
				<CheckboxGroup.Item label="May be" value="2" />
			</CheckboxGroup>
			<h5>Disabled</h5>
			<CheckboxGroup
				name="c"
				legend="Combine <fieldset> with the <legend> tag to provide a caption or title for the group."
			>
				<CheckboxGroup.Item label="Yes" value="1" />
				<CheckboxGroup.Item label="No" value="0" />
				<CheckboxGroup.Item label="May be" value="2" disabled />
			</CheckboxGroup>
			<h5>Disabled All</h5>
			<CheckboxGroup
				name="c"
				legend="Combine <fieldset> with the <legend> tag to provide a caption or title for the group."
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
				required
			>
				<CheckboxGroup.Item label="Yes" value="1" />
				<CheckboxGroup.Item label="No" value="0" />
				<CheckboxGroup.Item label="May be" value="2" />
			</CheckboxGroup>
			<h5>Grid</h5>
			<CheckboxGroup
				name="e"
				legend="Combine <fieldset> with the <legend> tag to provide a caption or title for the group."
				display="grid"
			>
				<CheckboxGroup.Item label="One" value="1" />
				<CheckboxGroup.Item label="Two" value="2" />
				<CheckboxGroup.Item label="Three" value="3" />
				<CheckboxGroup.Item label="Four" value="4" />
				<CheckboxGroup.Item label="Five" value="5" />
				<CheckboxGroup.Item label="Six" value="6" />
				<CheckboxGroup.Item label="Sevene" value="7" />
			</CheckboxGroup>
		</div>
	);
}

const checkboxRoute = createRoute({
	getParentRoute: () => indexRoute,
	path: "checkbox",
	component: CheckboxPage,
});

export { checkboxRoute };
