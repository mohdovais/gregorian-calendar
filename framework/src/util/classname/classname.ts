type PossibleClassName = string | boolean | null | undefined;
type PossibleArg = PossibleClassName | PossibleClassName[];

function classname(...names: PossibleArg[]) {
	return names.flat().filter(Boolean).join(" ");
}

export { classname };
