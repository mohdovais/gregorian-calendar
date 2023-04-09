import { forwardRef, useCallback, useMemo, useState } from "react";
import { ensureArray } from "../utils/array";
import { classname } from "../utils/classname";
import { isFunction, noop } from "../utils/function";
import css from "./Listbox.module.css";
import {
	ListGroupOrItem,
	ListItem,
	ListGroup,
	updateMultipleSelection,
	createItems,
	ListGroupOrItemConfig,
	findNextFocusableItem,
	ListItemConfig,
	findPrevFocusableItem,
	selectAll,
	findFirstFoucsableItem,
	findItemByValue,
	useStateRef,
	preventEvent,
} from "./utils";
import { useEnsuredId } from "../hooks/useId";
import { ListboxItemProps } from "./ListboxItem";
import { renderTree } from "./tree";

const TRUE = true;

interface ListboxCommonProps<T> {
	id?: string;
	className?: string;
	style?: React.CSSProperties;
	show?: boolean;
	ref?: React.Ref<HTMLUListElement>;

	items: ListGroupOrItem<T>[];
	role?: React.AriaRole;
	itemRole?: React.AriaRole;

	groupClassName?: string;
	optionClassName?: string;
	disabled?: boolean;

	onActiveDescendantChange?: (
		activeDescendant: ListItem<T> | undefined,
	) => void;
	onKeyDown?: React.KeyboardEventHandler<HTMLUListElement>;
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
	ItemTpl: ListboxItemProps<ValueType>["ItemTpl"];
} & ListboxConditionalProps<ValueType, IsMultiple>;

type LocalState<ValueType> = {
	items: ListGroupOrItemConfig<ValueType>[];
	activeNode?: ListItemConfig<ValueType>;
	selection: ValueType[];
	multiple: boolean;
	onSelect: CallableFunction;
	onActiveDescendantChange: ListboxCommonProps<ValueType>["onActiveDescendantChange"];
};

function Listbox<ValueType, IsMultiple extends boolean>(
	props: ListboxProps<ValueType, IsMultiple>,
	ref?: React.Ref<HTMLUListElement>,
) {
	const {
		role = "listbox",
		className,
		style,
		multiple,
		disabled,
		onSelect = noop,
		onActiveDescendantChange = noop as Required<
			ListboxProps<ValueType, IsMultiple>
		>["onActiveDescendantChange"],
		show = true,
		onKeyDown,
	} = props;

	const selection = ensureArray(props.selection);
	const [activeNode, setActiveNode] = useState<
		ListItemConfig<ValueType> | undefined
	>();

	const id = useEnsuredId("listbox-", props.id);

	const items = useMemo(
		() => createItems(props.items, disabled === true, id),
		[props.items, disabled, id],
	);

	const stateRef = useStateRef<LocalState<ValueType>>({
		activeNode,
		selection,
		items,
		multiple: multiple === true,
		onSelect,
		onActiveDescendantChange,
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

					if (nextNode != null && isFunction(onActiveDescendantChange)) {
						onActiveDescendantChange(nextNode);
					}

					setActiveNode((state) => (nextNode == null ? state : nextNode));

					break;
				}
				case "ArrowUp": {
					preventEvent(event);
					const nextNode = findPrevFocusableItem(items, activeNode);

					if (nextNode != null && isFunction(onActiveDescendantChange)) {
						onActiveDescendantChange(nextNode);
					}

					setActiveNode((state) => (nextNode == null ? state : nextNode));

					break;
				}
				case "a":
				case "A": {
					if (multiple && event.ctrlKey) {
						preventEvent(event);
						onSelect(selectAll(items));
					}
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
				}
				default: {
					isFunction(onKeyDown) && onKeyDown(event);
				}
			}
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

			if (isFunction(onActiveDescendantChange)) {
				onActiveDescendantChange(activeDescendant);
			}

			setActiveNode(activeDescendant);
		},
		[],
	);

	const blurHandler = useCallback(() => {
		const activeDescendant = undefined;
		if (isFunction(onActiveDescendantChange)) {
			onActiveDescendantChange(activeDescendant);
		}
		setActiveNode(activeDescendant);
	}, []);

	const selectionHandler = useCallback((item: ListItemConfig<ValueType>) => {
		const { multiple, selection } = stateRef.current;
		onSelect(
			multiple ? updateMultipleSelection(selection, item.value) : item.value,
			item,
		);
	}, []);

	return (
		<ul
			id={id}
			className={classname(css.list, className)}
			style={style}
			role={role}
			aria-activedescendant={activeNode == null ? "" : activeNode.id}
			aria-multiselectable={multiple || undefined}
			tabIndex={0}
			onKeyDown={keyDownHandler}
			onFocus={focusHandler}
			ref={ref}
			hidden={!show}
		>
			{show
				? renderTree<ValueType, IsMultiple>(
						items,
						props,
						activeNode,
						selectionHandler,
				  )
				: null}
		</ul>
	);
}

const ListboxWithRef = forwardRef(Listbox) as typeof Listbox;

export { ListboxWithRef as Listbox };

export type { ListItem, ListGroup, ListGroupOrItem, ListboxProps };
