import { copy } from "../utils/object";

type NumericString = string & { type: "numeric" };

type InputState = {
	_pattern: string;
	_placeholder: string;
	_value: string;
	currentValue: string;
	mask: string;
	patternString: string;
	patternRegExp: RegExp;
	isValid: boolean;
};

type InitializerArg = {
	value?: string;
	pattern?: string;
	placeholder?: string;
};

function _applyPattern(pattern: string, numeric: string) {
	const vLength = numeric.length;
	const pLength = pattern.length;
	let i: number;
	let result = pattern;

	if (vLength === 0 || pLength === 0) {
		return numeric;
	}

	for (i = 0; i < vLength; i++) {
		result = result.replace("#", numeric.charAt(i));
	}

	const hashIndex = result.indexOf("#");

	return hashIndex === -1 ? result : result.substring(0, hashIndex);
}

function isNumericChar(str: string) {
	const charCode = str.charCodeAt(0);
	return str.length === 1 && charCode > 47 && charCode < 58;
}

function filterNumeric(str: string) {
	let result = "";
	let charCode: number;
	const length = str.length;
	for (let i = 0; i < length; i++) {
		charCode = str.charCodeAt(i);
		if (charCode > 47 && charCode < 58) {
			result = result + str.charAt(i);
		}
	}
	return result as NumericString;
}

function applyPlaceholder(palceholder: string, value: string) {
	return value + palceholder.substring(value.length);
}

type InputValueChangeAction = {
	type: "input_v";
	value: string;
};

type PropValueChangeAction = {
	type: "prop_v";
	value: string;
};

type Action = InputValueChangeAction | PropValueChangeAction;

function initializer(args: InitializerArg): InputState {
	const { pattern = "", placeholder = "", value = "" } = args;

	const patternRegExpString = pattern.replace(
		/#+/g,
		(part) => "\\d{" + part.length + "}",
	);

	return store(
		{
			_pattern: pattern,
			_placeholder: placeholder,
			_value: "",
			currentValue: value,
			mask: "",
			patternString: patternRegExpString,
			patternRegExp:
				patternRegExpString === "" ? /(?:)/ : new RegExp(patternRegExpString),
			isValid: true,
		},
		{ type: "prop_v", value },
	);
}

function store(state: InputState, action: Action): InputState {
	switch (action.type) {
		case "input_v": {
			const value = _applyPattern(state._pattern, filterNumeric(action.value));
			return value === state._value
				? state
				: copy(state, {
						_value: value,
						mask: applyPlaceholder(state._placeholder, value),
						isValid: value === "" || state.patternRegExp.test(value),
				  });
		}
		case "prop_v": {
			return store(copy(state, { currentValue: action.value }), {
				type: "input_v",
				value: action.value,
			});
		}
	}
	return state;
}

const ignoreKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Tab", "Escape"];

function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
	if (event.ctrlKey || event.metaKey || ignoreKeys.includes(event.code)) {
		return;
	}

	if (isNaN(event.key as unknown as number)) {
		event.preventDefault();
		event.stopPropagation();
	}
}

export { store, initializer, onKeyDown, isNumericChar };
export type { InitializerArg, InputState };
