import { useState } from "react";

function createRandomId(prefix = "") {
	return prefix + (Date.now() + ((Math.random() * 1e10) | 0)).toString(32);
}

function useId(prefix?: string) {
	const ref = useState(() => createRandomId(prefix));
	return ref[0];
}

function useEnsuredId(prefix?: string, defaultId?: string) {
	const randomId = useId("listbox-");
	return typeof defaultId === "string" ? defaultId : randomId;
}

export { useId, createRandomId, useEnsuredId };
