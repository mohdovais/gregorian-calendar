const noop = Function.prototype;

const identityFn = <T>(x: T) => x;

function isFunction(arg: unknown): arg is CallableFunction {
	return typeof arg === "function";
}

export { noop, identityFn, isFunction };
