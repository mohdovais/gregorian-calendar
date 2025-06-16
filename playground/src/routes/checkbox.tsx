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
				<CheckboxGroup.Item value="1">Yes</CheckboxGroup.Item>
				<CheckboxGroup.Item value="0">No</CheckboxGroup.Item>
				<CheckboxGroup.Item value="2">May be</CheckboxGroup.Item>
			</CheckboxGroup>
			<h5>Horizontal</h5>
			<CheckboxGroup
				name="b"
				legend="Combine <fieldset> with the <legend> tag to provide a caption or title for the group."
				display="inline"
			>
				<CheckboxGroup.Item value="1">Yes</CheckboxGroup.Item>
				<CheckboxGroup.Item value="0">No</CheckboxGroup.Item>
				<CheckboxGroup.Item value="2">May be</CheckboxGroup.Item>
			</CheckboxGroup>
			<h5>Disabled</h5>
			<CheckboxGroup
				name="c"
				legend="Combine <fieldset> with the <legend> tag to provide a caption or title for the group."
			>
				<CheckboxGroup.Item value="1">Yes</CheckboxGroup.Item>
				<CheckboxGroup.Item value="0">No</CheckboxGroup.Item>
				<CheckboxGroup.Item value="2" disabled>
					May be
				</CheckboxGroup.Item>
			</CheckboxGroup>
			<h5>Disabled All</h5>
			<CheckboxGroup
				name="c"
				legend="Combine <fieldset> with the <legend> tag to provide a caption or title for the group."
				disabled
				value="0"
			>
				<CheckboxGroup.Item value="1">Yes</CheckboxGroup.Item>
				<CheckboxGroup.Item value="0">No</CheckboxGroup.Item>
				<CheckboxGroup.Item value="2">May be</CheckboxGroup.Item>
			</CheckboxGroup>
			<h5>Required</h5>
			<CheckboxGroup
				name="c"
				legend="Combine <fieldset> with the <legend> tag to provide a caption or title for the group."
				required
			>
				<CheckboxGroup.Item value="1">Yes</CheckboxGroup.Item>
				<CheckboxGroup.Item value="0">No</CheckboxGroup.Item>
				<CheckboxGroup.Item value="2">May be</CheckboxGroup.Item>
			</CheckboxGroup>
			<h5>Grid</h5>
			<CheckboxGroup
				name="e"
				legend="Combine <fieldset> with the <legend> tag to provide a caption or title for the group."
				display="grid"
			>
				<CheckboxGroup.Item value="1">One</CheckboxGroup.Item>
				<CheckboxGroup.Item value="2">Two</CheckboxGroup.Item>
				<CheckboxGroup.Item value="3">Three</CheckboxGroup.Item>
				<CheckboxGroup.Item value="4">Four</CheckboxGroup.Item>
				<CheckboxGroup.Item value="5">Five</CheckboxGroup.Item>
				<CheckboxGroup.Item value="6">Six</CheckboxGroup.Item>
				<CheckboxGroup.Item value="7">Seven</CheckboxGroup.Item>
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
