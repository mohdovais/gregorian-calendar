import { useEnsuredId } from "../hooks/useId";
import { ensureArray } from "../utils/array";
import { classname } from "../utils/classname";
import { isFunction, noop } from "../utils/function";
import css from "./Listbox.module.css";
import { ListboxItemProps, ListboxItemTplProps } from "./ListboxItem";
import { renderTree } from "./tree";
import {
	ListGroup,
	ListGroupOrItem,
	ListGroupOrItemConfig,
	ListItem,
	ListItemConfig,
	createItems,
	findFirstFoucsableItem,
	findItemByValue,
	findNextFocusableItem,
	findPrevFocusableItem,
	preventEvent,
	selectAll,
	updateMultipleSelection,
	useStateRef,
} from "./utils";
import { forwardRef, useCallback, useMemo, useState } from "react";

const TRUE = true;

interface ListboxCommonProps<T>
	extends Omit<
		React.DetailedHTMLProps<
			React.HTMLAttributes<HTMLUListElement>,
			HTMLUListElement
		>,
		"onSelect"
	> {
	expanded?: boolean;
	disabled?: boolean;
	items: ListGroupOrItem<T>[];
	itemTpl: ListboxItemProps<T>["itemTpl"];
	itemRole?: React.AriaRole;
	itemClassName?: string;
	groupClassName?: string;
	onActiveDescChange?: (activeDescendant: ListItem<T> | undefined) => void;
	onCollapse?: () => void;
}

interface ListboxSingleProps<T> extends ListboxCommonProps<T> {
	selection?: T;
	onSelect?: (newSelection: T) => void;
}

interface ListboxMultipleProps<T> extends ListboxCommonProps<T> {
	selection?: T[];
	onSelect?: (newSelection: T[]) => void;
}

type ListboxConditionalProps<ValueType, IsMultiple> =
	IsMultiple extends typeof TRUE
		? ListboxMultipleProps<ValueType>
		: ListboxSingleProps<ValueType>;

type ListboxProps<ValueType, IsMultiple> = {
	multiple?: IsMultiple;
} & ListboxConditionalProps<ValueType, IsMultiple>;

type LocalState<ValueType> = {
	items: ListGroupOrItemConfig<ValueType>[];
	activeNode?: ListItemConfig<ValueType>;
	selection: ValueType[];
	multiple: boolean;
	onSelect: CallableFunction;
	onActiveDescendantChange: ListboxCommonProps<ValueType>["onActiveDescChange"];
};

function Listbox<ValueType, IsMultiple extends boolean>(
	props: ListboxProps<ValueType, IsMultiple>,
	ref?: React.Ref<HTMLUListElement>,
) {
	const {
		role = "listbox",
		itemRole = "listitem",
		itemTpl,
		expanded = true,
		tabIndex = 0,
		multiple = false,
		disabled = false,
		className,
		items,

		onSelect = noop,
		onCollapse = noop,
		onActiveDescChange = noop as Required<
			ListboxProps<ValueType, IsMultiple>
		>["onActiveDescChange"],
		onMouseOut,
		onKeyDown,
		onFocus,
		onBlur,
		...restUlProps
	} = props;

	const selection = ensureArray(props.selection);
	const [hoverNode, setHoverNode] = useState<
		ListItemConfig<ValueType> | undefined
	>();
	const [keyboardActiveNode, setKeyboardActiveNode] = useState<
		ListItemConfig<ValueType> | undefined
	>();

	const id = useEnsuredId("listbox-", props.id);

	const listboxItems = useMemo(
		() => createItems(items, disabled === true, id),
		[items, disabled, id],
	);

	const stateRef = useStateRef<LocalState<ValueType>>({
		activeNode: keyboardActiveNode,
		selection,
		items: listboxItems,
		multiple: multiple === true,
		onSelect,
		onActiveDescendantChange: onActiveDescChange,
	});

	const keyDownHandler = useCallback(
		(event: React.KeyboardEvent<HTMLUListElement>) => {
			const {
				activeNode,
				selection,
				items,
				multiple,
				onActiveDescendantChange,
				onSelect,
			} = stateRef.current;

			switch (event.key) {
				case "ArrowDown": {
					preventEvent(event);
					const nextNode = findNextFocusableItem(items, activeNode);

					if (nextNode != null) {
						document.getElementById(nextNode.id)?.focus();
						isFunction(onActiveDescendantChange) &&
							onActiveDescendantChange(nextNode);
					}

					setKeyboardActiveNode((state) =>
						nextNode == null ? state : nextNode,
					);

					break;
				}
				case "ArrowUp": {
					preventEvent(event);
					const nextNode = findPrevFocusableItem(items, activeNode);

					if (nextNode != null) {
						document.getElementById(nextNode.id)?.focus();
						isFunction(onActiveDescendantChange) &&
							onActiveDescendantChange(nextNode);
					}

					setKeyboardActiveNode((state) =>
						nextNode == null ? state : nextNode,
					);

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
					if (activeNode != null) {
						preventEvent(event);
						onSelect(
							multiple
								? updateMultipleSelection(selection, activeNode.value)
								: activeNode.value,
							activeNode,
						);
					}
					break;
				}
				case "Escape":
					onCollapse();
					break;
			}

			isFunction(onKeyDown) && onKeyDown(event);
		},
		[],
	);

	const itemMouseOverHandler = useCallback(
		(item: ListItemConfig<ValueType>) => {
			setHoverNode(item.disabled ? undefined : item);
		},
		[],
	);

	const mouseOutHandler = useCallback(
		(event: React.MouseEvent<HTMLUListElement>) => {
			setHoverNode(undefined);
			isFunction(onMouseOut) && onMouseOut(event);
		},
		[],
	);

	const focusHandler = useCallback(
		(event: React.FocusEvent<HTMLUListElement>) => {
			// if relatedTarget is null, then most probably it is not keyboard tab
			if (event.relatedTarget == null) {
				return;
			}

			const { activeNode, selection, items } = stateRef.current;

			let activeDescendant = activeNode;

			if (activeDescendant == null && selection[0] != null) {
				activeDescendant = findItemByValue(items, selection[0]);
			}

			if (activeDescendant == null) {
				activeDescendant = findFirstFoucsableItem(items);
			}

			if (isFunction(onActiveDescChange)) {
				onActiveDescChange(activeDescendant);
			}

			setKeyboardActiveNode(activeDescendant);

			isFunction(onFocus) && onFocus(event);
		},
		[],
	);

	const blurHandler = useCallback(
		(event: React.FocusEvent<HTMLUListElement>) => {
			const target = event.target;
			const relatedTarget = event.relatedTarget;
			const activeDescendant = undefined;

			if (relatedTarget == null && !target.contains(relatedTarget)) {
				setKeyboardActiveNode(activeDescendant);
				if (isFunction(onActiveDescChange)) {
					onActiveDescChange(activeDescendant);
				}
			}

			isFunction(onBlur) && onBlur(event);
		},
		[],
	);

	const selectionHandler = useCallback((item: ListItemConfig<ValueType>) => {
		const { multiple, selection } = stateRef.current;
		onSelect(
			multiple ? updateMultipleSelection(selection, item.value) : item.value,
			item,
		);
	}, []);

	return (
		<ul
			{...restUlProps}
			ref={ref}
			id={id}
			className={classname(css.list, className)}
			role={role}
			tabIndex={tabIndex}
			hidden={!expanded}
			onMouseOut={mouseOutHandler}
			onFocus={focusHandler}
			onBlur={blurHandler}
			onKeyDown={keyDownHandler}
			aria-activedescendant={
				keyboardActiveNode == null ? "" : keyboardActiveNode.id
			}
			aria-multiselectable={multiple || undefined}
		>
			{expanded
				? renderTree<ValueType, IsMultiple>(
						listboxItems,
						props,
						hoverNode,
						keyboardActiveNode,
						selectionHandler,
						itemMouseOverHandler,
				  )
				: null}
		</ul>
	);
}

const ListboxWithRef = forwardRef(Listbox) as typeof Listbox;

export { ListboxWithRef as Listbox };

export type {
	ListItem,
	ListGroup,
	ListGroupOrItem,
	ListboxProps,
	ListboxItemTplProps,
};
