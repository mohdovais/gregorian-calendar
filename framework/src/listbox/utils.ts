import { useRef } from "react";
import { createRandomId } from "../hooks/useId";
import { ensureArray } from "../utils/array";
import { hasKey } from "../utils/object";

const NODE_TYPE_OPTION = "o";
const NODE_TYPE_GROUP = "g";

interface Option<T> extends Record<string, unknown> {
	id?: string;
	label: string | React.ReactNode;
	value: T;
	disabled?: boolean;
}

interface OptGroup<T> extends Record<string, unknown> {
	disabled?: boolean;
	label?: string;
	items: Option<T>[];
}

type GroupOrOption<T> = Option<T> | OptGroup<T>;

interface PrivateOption<T> extends Option<T> {
	type: typeof NODE_TYPE_OPTION;
	id: string;
	disabled: boolean;
}

interface PrivateOptGroup<T> extends OptGroup<T> {
	type: typeof NODE_TYPE_GROUP;
	id: string;
	disabled: boolean;
	label: string;
	items: PrivateOption<T>[];
}

type PrivateGroupOrOption<T> = PrivateOption<T> | PrivateOptGroup<T>;

const isOption = <T>(option: GroupOrOption<T>): option is Option<T> => {
	return hasKey(option, "value");
};

const keysCache = new WeakMap<object, string>();
function getKeyForObject(obj: object, prefix?: string): string {
	const oldKey = keysCache.get(obj);
	if (oldKey != null) {
		return oldKey;
	} else {
		const newKey = createRandomId(prefix);
		keysCache.set(obj, newKey);
		return newKey;
	}
}

function useStateRef<T>(state: T) {
	const stateRef = useRef(state);
	stateRef.current = state;
	return stateRef;
}

function doFindOption<T>(
	options: PrivateGroupOrOption<T>[],
	callback: (
		item: PrivateOption<T>,
		array: Readonly<PrivateGroupOrOption<T>[]>,
	) => unknown,
	reverse = false,
): PrivateOption<T> | undefined {
	const items = reverse
		? ensureArray(options, true).reverse()
		: ensureArray(options);

	for (let i = 0, length = items.length; i < length; i++) {
		const optionOrGroup = items[i];
		if (optionOrGroup.type === NODE_TYPE_OPTION) {
			if (callback(optionOrGroup, items) === true) {
				return optionOrGroup;
			}
		} else {
			const result = doFindOption(optionOrGroup.items, callback, reverse);
			if (result != null) {
				return result;
			}
		}
	}
}

function findOption<T>(
	options: PrivateGroupOrOption<T>[],
	callback: (
		item: PrivateOption<T>,
		array: Readonly<PrivateGroupOrOption<T>[]>,
	) => unknown,
) {
	return doFindOption(options, callback);
}

function findOptionReverse<T>(
	options: PrivateGroupOrOption<T>[],
	callback: (
		item: PrivateOption<T>,
		array: Readonly<PrivateGroupOrOption<T>[]>,
	) => unknown,
) {
	return doFindOption(options, callback, true);
}

function updateMultipleSelection<T>(
	currentSelections: T[],
	newSelection: T,
): T[] {
	const result: T[] = [];
	let removed = false;
	currentSelections.forEach((oldSelection) => {
		if (oldSelection === newSelection) {
			removed = true;
		} else {
			result.push(oldSelection);
		}
	});
	if (!removed) {
		result.push(newSelection);
	}
	return result;
}

function createItems<T>(
	options: GroupOrOption<T>[],
	parentDisabled: boolean,
	optionTpl?: (option: Option<T>) => React.ReactNode,
): PrivateGroupOrOption<T>[] {
	const items: PrivateGroupOrOption<T>[] = [];
	const hasOptionTpl = typeof optionTpl === "function";

	ensureArray(options).forEach((option) => {
		const disabled = parentDisabled || option.disabled === true;
		if (isOption(option)) {
			items.push(
				Object.assign({}, option, {
					type: NODE_TYPE_OPTION,
					id: option.id || getKeyForObject(option, "item-"),
					label: hasOptionTpl ? optionTpl(option) : option.label,
					disabled,
				}) as PrivateOption<T>,
			);
		} else {
			items.push(
				Object.assign({}, option, {
					type: NODE_TYPE_GROUP,
					id: option.id || getKeyForObject(option, "group-"),
					disabled,
					label: option.label || "",
					items: createItems(option.items, disabled),
				}) as PrivateOptGroup<T>,
			);
		}
	});

	return items;
}

function selectAll<T>(options: PrivateGroupOrOption<T>[]) {
	let result: T[] = [];
	options.forEach((node) => {
		if (node.type === NODE_TYPE_OPTION && !node.disabled) {
			result.push(node.value);
			return;
		}

		if (node.type === NODE_TYPE_GROUP && !node.disabled) {
			result = result.concat(selectAll(node.items));
		}
	});

	return result;
}

function findFirstFoucsableOption<T>(options: PrivateGroupOrOption<T>[]) {
	return findOption(options, (option) => {
		if (!option.disabled) {
			return true;
		}
	});
}

function findOptionByValue<T>(options: PrivateGroupOrOption<T>[], value: T) {
	return findOption(options, (option) => {
		if (option.value === value) {
			return true;
		}
	});
}

function findNextFocusableOption<T>(
	options: PrivateGroupOrOption<T>[],
	currentOption: PrivateOption<T> | undefined,
	reverse = false,
) {
	const iterator = reverse ? findOptionReverse : findOption;
	let found = false;
	const nextOption = iterator(options, (item) => {
		if (!item.disabled && (found || currentOption === undefined)) {
			return true;
		}
		if (item === currentOption) {
			found = true;
		}
	});
	return found ? nextOption : currentOption;
}

function findPrevFocusableOption<T>(
	options: PrivateGroupOrOption<T>[],
	currentOption: PrivateOption<T> | undefined,
) {
	return findNextFocusableOption(options, currentOption, true);
}

export {
	updateMultipleSelection,
	createItems,
	findNextFocusableOption,
	findPrevFocusableOption,
	findFirstFoucsableOption,
	findOptionByValue,
	selectAll,
	NODE_TYPE_GROUP,
	NODE_TYPE_OPTION,
	useStateRef,
};
export type {
	Option,
	OptGroup,
	GroupOrOption,
	PrivateGroupOrOption,
	PrivateOptGroup,
	PrivateOption,
};
