const noop = Function.prototype;

const identityFn = <T>(x: T) => x;

function isFunction(arg: unknown): arg is CallableFunction {
	return typeof arg === "function";
}

function ensureCallableFunction<T extends CallableFunction>(fn: T | undefined) {
	return isFunction(fn) ? fn : (noop as T);
}

// biome-ignore lint/complexity/noBannedTypes: <explanation>
type ArgumentTypes<F extends Function> = F extends (...args: infer A) => unknown
	? A
	: never;

// biome-ignore lint/complexity/noBannedTypes: <explanation>
function createDefferedFunction<T extends Function>(fn: T, delay = 1) {
	let t: number;

	return (...args: ArgumentTypes<T>) => {
		clearTimeout(t);
		t = setTimeout(fn, delay, ...args);
	};
}

export {
	noop,
	identityFn,
	isFunction,
	ensureCallableFunction,
	createDefferedFunction,
};
