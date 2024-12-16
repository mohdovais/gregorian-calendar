function escapeRegExpString(string: string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

export { escapeRegExpString };
