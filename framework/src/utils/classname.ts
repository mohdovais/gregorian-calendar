type PossibleClassName = string | boolean | null | undefined;
type PossibleArg = PossibleClassName | PossibleClassName[];

function classname(...names: PossibleArg[]) {
	const name = names.flat().filter(Boolean).join(" ").trim();
	return name === "" ? undefined : name;
}

export { classname };
