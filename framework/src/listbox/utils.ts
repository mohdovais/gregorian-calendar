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

function selectMultiple<T>(currentSelections: T[], newSelection: T): T[] {
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

function _doFindNextOption<T>(
	options: PrivateGroupOrOption<T>[],
	currentActiveNode: PrivateOption<T> | undefined,
	foundCurrentNode = false,
): { node: PrivateOption<T> | undefined; found: boolean } {
	const noCurrentActiveNode = currentActiveNode == null;

	for (let i = 0, length = options.length; i < length; i++) {
		const option = options[i];

		if (option.type === NODE_TYPE_OPTION && !option.disabled) {
			if (noCurrentActiveNode || foundCurrentNode) {
				return { node: option, found: foundCurrentNode };
			}

			if (option === currentActiveNode) {
				foundCurrentNode = true;
			}
		}

		if (option.type === NODE_TYPE_GROUP && !option.disabled) {
			const group = _doFindNextOption(
				option.items,
				currentActiveNode,
				foundCurrentNode,
			);
			foundCurrentNode = group.found;
			if (group.node != null) {
				return group;
			}
		}
	}

	return { node: undefined, found: foundCurrentNode };
}

function findNextOption<T>(
	options: PrivateGroupOrOption<T>[],
	currentActiveNode: PrivateOption<T> | undefined,
): PrivateOption<T> | undefined {
	return (
		_doFindNextOption(options, currentActiveNode).node || currentActiveNode
	);
}

function _doFindPreviousOption<T>(
	options: PrivateGroupOrOption<T>[],
	currentActiveNode: PrivateOption<T> | undefined,
	foundCurrentNode = false,
): { node: PrivateOption<T> | undefined; found: boolean } {
	const noCurrentActiveNode = currentActiveNode == null;

	for (let i = options.length - 1; i >= 0; i--) {
		const option = options[i];

		if (option.type === NODE_TYPE_OPTION && !option.disabled) {
			if (noCurrentActiveNode || foundCurrentNode) {
				return { node: option, found: foundCurrentNode };
			}

			if (option === currentActiveNode) {
				foundCurrentNode = true;
			}
		}

		if (option.type === NODE_TYPE_GROUP && !option.disabled) {
			const group = _doFindPreviousOption(
				option.items,
				currentActiveNode,
				foundCurrentNode,
			);
			foundCurrentNode = group.found;
			if (group.node != null) {
				return group;
			}
		}
	}

	return { node: undefined, found: foundCurrentNode };
}

function findPreviousOption<T>(
	options: PrivateGroupOrOption<T>[],
	currentActiveNode: PrivateOption<T> | undefined,
): PrivateOption<T> | undefined {
	return (
		_doFindPreviousOption(options, currentActiveNode).node || currentActiveNode
	);
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

export {
	selectMultiple,
	createItems,
	findNextOption,
	findPreviousOption,
	selectAll,
	NODE_TYPE_GROUP,
	NODE_TYPE_OPTION,
};
export type {
	Option,
	OptGroup,
	GroupOrOption,
	PrivateGroupOrOption,
	PrivateOptGroup,
	PrivateOption,
};
