import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import { RadioGroup } from "framework/radio/radio-group";

function RadioPage() {
	return (
		<div>
			<RadioGroup
				name="c"
				legend="Combine <fieldset> with the <legend> tag to provide a caption or title for the group."
			>
				<RadioGroup.Item label="Yes" value="1" />
				<RadioGroup.Item label="No" value="0" />
				<RadioGroup.Item label="May be" value="2" />
			</RadioGroup>

			<RadioGroup
				name="d"
				legend="Combine <fieldset> with the <legend> tag to provide a caption or title for the group."
				value="0"
				horizontal
			>
				<RadioGroup.Item label="Yes" value="1" />
				<RadioGroup.Item label="No" value="0" />
				<RadioGroup.Item label="May be" value="2" />
			</RadioGroup>
		</div>
	);
}

const radioRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "radio",
	component: RadioPage,
});

export { radioRoute };
