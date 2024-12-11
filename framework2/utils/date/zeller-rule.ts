const dateRe = /(\d{4})-(\d{2})-(\d{2})/;

function dayOfDate(dateString: string) {
	const exec = dateRe.exec(dateString);

	if (exec == null) {
		return;
	}

	const y = parseInt(exec[1], 10);
	const _m = parseInt(exec[2], 10);
	const k = parseInt(exec[3], 10);

	const CD = _m < 3 ? y - 1 : y;
	const D = CD % 100;
	const C = (CD - D) / 100;
	const m = (_m + 10) % 12 || 12;

	const F =
		k + (((13 * m - 1) / 5) | 0) + D + ((D / 4) | 0) + ((C / 4) | 0) - 2 * C;

	return (F % 7) + (F > 0 ? 0 : 7);
}

export { dayOfDate };
