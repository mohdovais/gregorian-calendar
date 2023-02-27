function classname(names: (string | boolean | null | undefined)[]) {
	return names.filter(Boolean).join(" ");
}

export { classname };
