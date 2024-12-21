function escapeRegExpString(string: string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

type PossibleClassName = string | boolean | null | undefined;

function classNames(...names: PossibleClassName[]) {
	const result: string[] = [];
	for (let i = 0; i < names.length; i++) {
		const name = names[i];
		if (typeof name === "string") {
			result.push(name);
		}
	}
	return result.length > 0 ? result.join(" ") : undefined;
}

export { classNames, escapeRegExpString };
