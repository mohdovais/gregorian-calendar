import {
	ListGroupOrItemConfig,
	ListItem,
	ListItemConfig,
	findFirstFoucsableItem,
	findItemByValue,
	findNextFocusableItem,
	findPrevFocusableItem,
	preventEvent,
	selectAll,
	updateMultipleSelection,
} from "./utils";
import { useCallback } from "react";

type ListboxRefState<T> = {
	multiple: boolean;
	items: ListGroupOrItemConfig<T>[];
	selection: T[];
	focusedItem?: ListItemConfig<T>;
	setFocusedItem: React.Dispatch<
		React.SetStateAction<ListItemConfig<T> | undefined>
	>;
	setHoverItem: React.Dispatch<
		React.SetStateAction<ListItemConfig<T> | undefined>
	>;
	onSelect: CallableFunction;
	onFocus: (event: React.FocusEvent<HTMLUListElement>) => void;
	onBlur: (event: React.FocusEvent<HTMLUListElement>) => void;
	onMouseOut: (event: React.MouseEvent<HTMLUListElement, MouseEvent>) => void;
	onKeyDown: (event: React.KeyboardEvent<HTMLUListElement>) => void;
	onActiveDescChange: (activeDescendant: ListItem<T> | undefined) => void;
	onCollapse: () => void;
};

function useMouseOutHandler<T>(
	stateRef: React.MutableRefObject<ListboxRefState<T>>,
) {
	return useCallback(
		(event: React.MouseEvent<HTMLUListElement>) => {
			const { setHoverItem, onMouseOut } = stateRef.current;
			setHoverItem(undefined);
			onMouseOut(event);
		},
		[stateRef],
	);
}

function useFocusHandler<T>(
	stateRef: React.MutableRefObject<ListboxRefState<T>>,
) {
	return useCallback(
		(event: React.FocusEvent<HTMLUListElement>) => {
			// if relatedTarget is null, then most probably it is not keyboard tab
			if (event.relatedTarget == null) {
				return;
			}

			const {
				focusedItem,
				selection,
				items,
				onFocus,
				onActiveDescChange,
				setFocusedItem,
			} = stateRef.current;

			let activeDescendant = focusedItem;

			if (activeDescendant == null && selection[0] != null) {
				activeDescendant = findItemByValue(items, selection[0]);
			}

			if (activeDescendant == null) {
				activeDescendant = findFirstFoucsableItem(items);
			}

			setFocusedItem(activeDescendant);
			onActiveDescChange(activeDescendant);
			onFocus(event);
		},
		[stateRef],
	);
}

function useBlurHandler<T>(
	stateRef: React.MutableRefObject<ListboxRefState<T>>,
) {
	return useCallback(
		(event: React.FocusEvent<HTMLUListElement>) => {
			const target = event.target;
			const relatedTarget = event.relatedTarget;
			const activeDescendant = undefined;
			const { onBlur, onActiveDescChange, setFocusedItem } = stateRef.current;

			if (relatedTarget == null && !target.contains(relatedTarget)) {
				setFocusedItem(activeDescendant);
				onActiveDescChange(activeDescendant);
			}

			onBlur(event);
		},
		[stateRef],
	);
}

function useSelectionHandler<T>(
	stateRef: React.MutableRefObject<ListboxRefState<T>>,
) {
	return useCallback(
		(item: ListItemConfig<T>) => {
			const { multiple, selection, onSelect } = stateRef.current;
			onSelect(
				multiple ? updateMultipleSelection(selection, item.value) : item.value,
				item,
			);
		},
		[stateRef],
	);
}

function useKeyDownHandler<T>(
	stateRef: React.MutableRefObject<ListboxRefState<T>>,
) {
	return useCallback((event: React.KeyboardEvent<HTMLUListElement>) => {
		const {
			focusedItem,
			selection,
			items,
			multiple,
			onActiveDescChange,
			onSelect,
			onCollapse,
			onKeyDown,
			setFocusedItem,
		} = stateRef.current;

		switch (event.key) {
			case "ArrowDown": {
				preventEvent(event);
				const nextNode = findNextFocusableItem(items, focusedItem);

				if (nextNode != null) {
					document.getElementById(nextNode.id)?.focus();
					onActiveDescChange(nextNode);
				}

				setFocusedItem((state) => (nextNode == null ? state : nextNode));

				break;
			}
			case "ArrowUp": {
				preventEvent(event);
				const nextNode = findPrevFocusableItem(items, focusedItem);

				if (nextNode != null) {
					document.getElementById(nextNode.id)?.focus();
					onActiveDescChange(nextNode);
				}

				setFocusedItem((state) => (nextNode == null ? state : nextNode));

				break;
			}
			case "a":
			case "A": {
				if (multiple && event.ctrlKey) {
					preventEvent(event);
					onSelect(selectAll(items));
				}
				break;
			}
			case "Enter": {
				if (focusedItem != null) {
					preventEvent(event);
					onSelect(
						multiple
							? updateMultipleSelection(selection, focusedItem.value)
							: focusedItem.value,
						focusedItem,
					);
				}
				break;
			}
			case "Escape":
				onCollapse();
				break;
		}

		onKeyDown(event);
	}, []);
}

export {
	useSelectionHandler,
	useFocusHandler,
	useBlurHandler,
	useMouseOutHandler,
	useKeyDownHandler,
};
export type { ListboxRefState };
