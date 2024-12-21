const emptyFn = Function.prototype;

const identityFn = <T>(x: T) => x;

function isFunction(arg: unknown): arg is CallableFunction {
	return typeof arg === "function";
}

type ArgumentTypes<F extends Function> = F extends (...args: infer A) => unknown
	? A
	: never;

function createDefferedFunction<T extends Function>(fn: T, delay = 100) {
	let t: number;

	return (...args: ArgumentTypes<T>) => {
		clearTimeout(t);
		t = setTimeout(fn, delay, ...args);
	};
}

export { createDefferedFunction, emptyFn, identityFn, isFunction };
