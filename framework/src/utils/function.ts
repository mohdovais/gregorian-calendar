const noop = Function.prototype;

const identityFn = <T>(x: T) => x;

function isFunction(arg: unknown): arg is CallableFunction {
	return typeof arg === "function";
}

function ensureCallableFunction<T extends CallableFunction>(fn: T | undefined) {
	return isFunction(fn) ? fn : (noop as T);
}

export { noop, identityFn, isFunction, ensureCallableFunction };
