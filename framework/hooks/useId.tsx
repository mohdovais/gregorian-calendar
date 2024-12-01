import { useState } from "react";

function createRandomId(prefix = "") {
	return prefix + (Date.now() + ((Math.random() * 1e5) | 0)).toString(32);
}

function createSmallRandomId(prefix = "") {
	return (
		prefix +
		(((Math.random() * 1e5) | 0) + ((Math.random() * 1e5) | 0)).toString(32)
	);
}

function useId(prefix?: string) {
	const ref = useState(() => createSmallRandomId(prefix));
	return ref[0];
}

function useEnsuredId(prefix?: string, defaultId?: string) {
	const randomId = useId(prefix);
	return typeof defaultId === "string" ? defaultId : randomId;
}

export { useId, createRandomId, createSmallRandomId, useEnsuredId };
