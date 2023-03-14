type Key = string | number | symbol;
type ObjectType =
	| "Number"
	| "String"
	| "Boolean"
	| "Symbol"
	| "Object"
	| "Array"
	| "Function"
	| "Null"
	| "Undefined";

function ensureNotNullOrUndefined<T>(
	value: T | undefined | null,
	defaultValue: T,
): T {
	return value == null ? defaultValue : value;
}

function copy<T>(object: T, props: Partial<T>): T {
	return Object.assign({}, object, props);
}

function hasKey<T>(obj: T, propName: Key): propName is keyof T {
	return Object.prototype.hasOwnProperty.call(obj, propName);
}

function typeOf(subject: unknown) {
	const str = Object.prototype.toString.call(subject);
	return str.substring(8, str.length - 1) as ObjectType;
}

export { ensureNotNullOrUndefined, copy, hasKey, typeOf };
