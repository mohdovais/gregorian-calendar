import { useState } from "react";
import { MaskedField } from "../../../framework/src/maskedfield/MaskedField";
import { isValidDateString } from "../../../framework/src/utils/date";

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

export { MaskedFieldPage as Component };
