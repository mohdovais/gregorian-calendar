const PENDING = 2;
const SUCCESS = 1;
const ERROR = 0;

function promiseReader<T>(promise: Promise<T>) {
	let status = PENDING;
	let response: T;

	const suspender = promise.then(
		(res) => {
			status = SUCCESS;
			response = res;
		},
		(err) => {
			status = ERROR;
			response = err;
		},
	);

	const read = () => {
		switch (status) {
			case PENDING:
				throw suspender;
			case ERROR:
				throw response;
			default:
				return response;
		}
	};

	return { read };
}

export { promiseReader };
