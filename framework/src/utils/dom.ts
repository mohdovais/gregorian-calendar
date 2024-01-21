function getKeyboardFocusableElements(root?: HTMLElement) {
	return Array.from(
		(root || document).querySelectorAll(
			'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])',
		),
	).filter(
		(el) =>
			!el.hasAttribute("disabled") &&
			!el.getAttribute("aria-hidden") &&
			el.getAttribute("type") !== "hidden",
	) as HTMLElement[];
}

export { getKeyboardFocusableElements };
