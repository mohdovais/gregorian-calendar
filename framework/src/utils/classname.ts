type PossibleClassName = string | boolean | null | undefined;
type PossibleArg = PossibleClassName | PossibleClassName[];

function classname(...names: PossibleArg[]) {
	var name = names.flat().filter(Boolean).join(" ").trim();
	return name === "" ? undefined : name;
}

export { classname };
