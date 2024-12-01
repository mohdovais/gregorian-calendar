function leftPad(item: string | number, length: number, pad = "0") {
	let x = String(item);
	while (x.length < length) {
		x = pad + x;
	}
	return x;
}

export { leftPad };
