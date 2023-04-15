import { useEnsuredId } from "../hooks/useId";
import { ensureArray } from "../utils/array";
import { classname } from "../utils/classname";
import { isFunction, noop } from "../utils/function";
import css from "./Listbox.module.css";
import { ListboxItemProps } from "./ListboxItem";
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

interface ListboxCommonProps<T> {
	id?: string;
	className?: string;
	style?: React.CSSProperties;
	show?: boolean;
	ref?: React.Ref<HTMLUListElement>;
	role?: React.AriaRole;
	disabled?: boolean;
	tabIndex?: number;

	items: ListGroupOrItem<T>[];
	itemTpl: ListboxItemProps<T>["itemTpl"];
	itemRole?: React.AriaRole;
	itemClassName?: string;

	groupClassName?: string;

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
		tabIndex = 0,
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

	const mouseOverHandler = useCallback((item: ListItemConfig<ValueType>) => {
		const activeDescendant = item.disabled ? undefined : item;
		setActiveNode(activeDescendant);
		if (isFunction(onActiveDescendantChange)) {
			onActiveDescendantChange(activeDescendant);
		}
	}, []);

	const mouseOutHandler = useCallback(() => {
		const activeDescendant = undefined;
		if (isFunction(onActiveDescendantChange)) {
			onActiveDescendantChange(activeDescendant);
		}
		setActiveNode(activeDescendant);
	}, []);

	const blurHandler = useCallback(
		(event: React.FocusEvent<HTMLUListElement>) => {
			const target = event.target;
			const relatedTarget = event.relatedTarget;
			const activeDescendant = undefined;

			if (relatedTarget == null && !target.contains(relatedTarget)) {
				setActiveNode(activeDescendant);
				if (isFunction(onActiveDescendantChange)) {
					onActiveDescendantChange(activeDescendant);
				}
			}
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
			id={id}
			className={classname(css.list, className)}
			style={style}
			role={role}
			tabIndex={tabIndex}
			ref={ref}
			hidden={!show}
			onMouseOut={mouseOutHandler}
			onFocus={focusHandler}
			onBlur={blurHandler}
			onKeyDown={keyDownHandler}
			aria-activedescendant={activeNode == null ? "" : activeNode.id}
			aria-multiselectable={multiple || undefined}
		>
			{show
				? renderTree<ValueType, IsMultiple>(
						items,
						props,
						activeNode,
						selectionHandler,
						mouseOverHandler,
				  )
				: null}
		</ul>
	);
}

const ListboxWithRef = forwardRef(Listbox) as typeof Listbox;

export { ListboxWithRef as Listbox };

export type { ListItem, ListGroup, ListGroupOrItem, ListboxProps };
