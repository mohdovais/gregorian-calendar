import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import { RadioGroup } from "framework/radio/radio-group";

function RadioPage() {
	return (
		<div>
			<RadioGroup
				name="a"
				legend="Combine <fieldset> with the <legend> tag to provide a caption or title for the group."
				value="0"
			>
				<RadioGroup.Item label="Yes" value="1" />
				<RadioGroup.Item label="No" value="0" />
				<RadioGroup.Item label="May be" value="2" />
			</RadioGroup>
			<h5>Horizontal</h5>
			<RadioGroup
				name="b"
				legend="Combine <fieldset> with the <legend> tag to provide a caption or title for the group."
				horizontal
			>
				<RadioGroup.Item label="Yes" value="1" />
				<RadioGroup.Item label="No" value="0" />
				<RadioGroup.Item label="May be" value="2" />
			</RadioGroup>
			<h5>Disabled</h5>
			<RadioGroup
				name="c"
				legend="Combine <fieldset> with the <legend> tag to provide a caption or title for the group."
				horizontal
			>
				<RadioGroup.Item label="Yes" value="1" />
				<RadioGroup.Item label="No" value="0" />
				<RadioGroup.Item label="May be" value="2" disabled />
			</RadioGroup>
			<h5>Disabled All</h5>
			<RadioGroup
				name="d"
				legend="Combine <fieldset> with the <legend> tag to provide a caption or title for the group."
				value="0"
				horizontal
				disabled
			>
				<RadioGroup.Item label="Yes" value="1" />
				<RadioGroup.Item label="No" value="0" />
				<RadioGroup.Item label="May be" value="2" />
			</RadioGroup>
			<h5>Required</h5>
			<form>
				<RadioGroup
					name="e"
					legend="Combine <fieldset> with the <legend> tag to provide a caption or title for the group."
					horizontal
					required
				>
					<RadioGroup.Item label="Yes" value="1" />
					<RadioGroup.Item label="No" value="0" />
					<RadioGroup.Item label="May be" value="2" />
				</RadioGroup>
			</form>
		</div>
	);
}

const radioRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "radio",
	component: RadioPage,
});

export { radioRoute };
