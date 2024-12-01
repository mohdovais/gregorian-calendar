import { createRoute } from "@tanstack/react-router";
import { MaskedField } from "framework/maskedfield/MaskedField";
import { isValidDateString } from "framework/utils/date";
import { useState } from "react";
import { rootRoute } from "./root";

const customValidity = (str: string) => {
	return str === "" ? "" : isValidDateString(str) ? "" : "incorrect date";
};

function MaskedFieldPage() {
	const [value, setValue] = useState<string | undefined>("2024-01-01");
	return (
		<MaskedField
			name="masked"
			pattern="####-##-##"
			placeholder="yyyy-mm-dd"
			value={value}
			onChange={setValue}
			customValidity={customValidity}
			size={10}
		/>
	);
}

const maskedFieldRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "masked-field",
	component: MaskedFieldPage,
});

export { maskedFieldRoute };
