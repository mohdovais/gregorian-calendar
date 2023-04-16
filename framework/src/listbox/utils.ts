import { createSmallRandomId } from "../hooks/useId";
import { ensureArray } from "../utils/array";
import { hasKey } from "../utils/object";
import { useRef } from "react";

const NODE_TYPE_ITEM = "item";
const NODE_TYPE_GROUP = "group";

interface ListItem<T> extends Record<string, unknown> {
	id?: string;
	label: string | React.ReactNode;
	value: T;
	items?: never;
	disabled?: boolean;
}

interface ListGroup<T> extends Record<string, unknown> {
	id?: string;
	label?: string | React.ReactNode;
	value?: T; //?? or never
	items: ListItem<T>[];
	disabled?: boolean;
}

type ListGroupOrItem<T> = ListItem<T> | ListGroup<T>;

interface ListItemConfig<T> extends Record<string, unknown> {
	type: typeof NODE_TYPE_ITEM;
	id: string;
	label: string | React.ReactNode;
	value: T;
	disabled: boolean;
}

interface ListGroupConfig<T> extends Record<string, unknown> {
	type: typeof NODE_TYPE_GROUP;
	id: string;
	label: string;
	items: ListItemConfig<T>[];
	disabled: boolean;
}

type ListGroupOrItemConfig<T> = ListItemConfig<T> | ListGroupConfig<T>;

const isItem = <T>(option: ListGroupOrItem<T>): option is ListItem<T> => {
	return !hasKey(option, "items");
};

function useStateRef<T>(state: T) {
	const stateRef = useRef(state);
	stateRef.current = state;
	return stateRef;
}

function doFindItem<T>(
	options: ListGroupOrItemConfig<T>[],
	callback: (
		item: ListItemConfig<T>,
		array: Readonly<ListGroupOrItemConfig<T>[]>,
	) => unknown,
	reverse = false,
): ListItemConfig<T> | undefined {
	const items = reverse
		? ensureArray(options, true).reverse()
		: ensureArray(options);

	for (let i = 0, length = items.length; i < length; i++) {
		const optionOrGroup = items[i];
		if (optionOrGroup.type === NODE_TYPE_ITEM) {
			if (callback(optionOrGroup, items) === true) {
				return optionOrGroup;
			}
		} else {
			const result = doFindItem(optionOrGroup.items, callback, reverse);
			if (result != null) {
				return result;
			}
		}
	}
}

function findItem<T>(
	options: ListGroupOrItemConfig<T>[],
	callback: (
		item: ListItemConfig<T>,
		array: Readonly<ListGroupOrItemConfig<T>[]>,
	) => unknown,
) {
	return doFindItem(options, callback);
}

function findItemReverse<T>(
	options: ListGroupOrItemConfig<T>[],
	callback: (
		item: ListItemConfig<T>,
		array: Readonly<ListGroupOrItemConfig<T>[]>,
	) => unknown,
) {
	return doFindItem(options, callback, true);
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
	options: ListGroupOrItem<T>[],
	parentDisabled: boolean,
	parentId: string,
): ListGroupOrItemConfig<T>[] {
	const result: ListGroupOrItemConfig<T>[] = [];

	ensureArray(options).forEach((option) => {
		const disabled = parentDisabled || option.disabled === true;
		if (isItem(option)) {
			result.push(
				Object.freeze(
					Object.assign({}, option, {
						type: NODE_TYPE_ITEM,
						id: option.id || createSmallRandomId(parentId + "-item-"),
						disabled,
					}),
				) as ListItemConfig<T>,
			);
		} else {
			result.push(
				Object.assign({}, option, {
					type: NODE_TYPE_GROUP,
					id: option.id || createSmallRandomId(parentId + "-group-"),
					disabled,
					label: option.label || "",
					items: createItems(option.items, disabled, parentId),
				}) as ListGroupConfig<T>,
			);
		}
	});

	return result;
}

function selectAll<T>(options: ListGroupOrItemConfig<T>[]) {
	let result: T[] = [];
	options.forEach((node) => {
		if (node.type === NODE_TYPE_ITEM && !node.disabled) {
			result.push(node.value);
			return;
		}

		if (node.type === NODE_TYPE_GROUP && !node.disabled) {
			result = result.concat(selectAll(node.items));
		}
	});

	return result;
}

function findFirstFoucsableItem<T>(items: ListGroupOrItemConfig<T>[]) {
	return findItem(items, (item) => !item.disabled);
}

function findItemByValue<T>(items: ListGroupOrItemConfig<T>[], item: T) {
	return findItem(items, (option) => option.value === item);
}

function findNextFocusableItem<T>(
	items: ListGroupOrItemConfig<T>[],
	currentItem: ListItemConfig<T> | undefined,
	reverse = false,
) {
	const iterator = reverse ? findItemReverse : findItem;
	let found = false;
	const nextOption = iterator(items, (item) => {
		if (!item.disabled && (found || currentItem === undefined)) {
			return true;
		}
		if (item === currentItem) {
			found = true;
		}
	});
	return found ? nextOption : currentItem;
}

function findPrevFocusableItem<T>(
	options: ListGroupOrItemConfig<T>[],
	currentOption: ListItemConfig<T> | undefined,
) {
	return findNextFocusableItem(options, currentOption, true);
}

function preventEvent(
	event:
		| React.KeyboardEvent<Element>
		| React.MouseEvent<Element>
		| React.FocusEvent<Element>,
) {
	event.preventDefault();
	event.stopPropagation();
}

export {
	updateMultipleSelection,
	createItems,
	findNextFocusableItem,
	findPrevFocusableItem,
	findFirstFoucsableItem,
	findItemByValue,
	selectAll,
	NODE_TYPE_GROUP,
	NODE_TYPE_ITEM,
	useStateRef,
	preventEvent,
};
export type {
	ListItem,
	ListGroup,
	ListGroupOrItem,
	ListGroupOrItemConfig,
	ListGroupConfig,
	ListItemConfig,
};
