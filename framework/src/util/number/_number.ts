// Math.min(max, Math.max(min, value)) is 4x slower
function bound(value: number, min: number, max: number) {
	return value < min ? min : value > max ? max : value;
}

export { bound };
