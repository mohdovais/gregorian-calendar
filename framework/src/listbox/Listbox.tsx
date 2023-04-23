import { useEnsuredId } from "../hooks/useId";
import { useStateRef } from "../hooks/useStateRef";
import { ensureArray } from "../utils/array";
import { classname } from "../utils/classname";
import { ensureCallableFunction } from "../utils/function";
import css from "./Listbox.module.css";
import { ListboxItemProps, ListboxItemTplProps } from "./ListboxItem";
import {
	ListboxRefState,
	useBlurHandler,
	useFocusHandler,
	useKeyDownHandler,
	useMouseOutHandler,
	useSelectionHandler,
} from "./hooks";
import { renderTree } from "./tree";
import {
	ListGroup,
	ListGroupOrItem,
	ListItem,
	ListItemConfig,
	createItems,
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
	itemTpl?: ListboxItemProps<T>["itemTpl"];
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

function Listbox<ValueType, IsMultiple extends boolean>(
	props: ListboxProps<ValueType, IsMultiple>,
	ref?: React.Ref<HTMLUListElement>,
) {
	const {
		role = "listbox",
		itemRole = "listitem",
		expanded = true,
		tabIndex = 0,
		multiple = false,
		disabled = false,
		className,
		items,
		itemTpl,

		onSelect,
		onCollapse,
		onActiveDescChange,
		onMouseOut,
		onKeyDown,
		onFocus,
		onBlur,
		...restUlProps
	} = props;

	const selection = ensureArray(props.selection);
	const [hoverItem, setHoverItem] = useState<
		ListItemConfig<ValueType> | undefined
	>();
	const [focusedItem, setFocusedItem] = useState<
		ListItemConfig<ValueType> | undefined
	>();

	const id = useEnsuredId("listbox-", props.id);

	const listboxItems = useMemo(
		() => createItems(items, disabled === true, id),
		[items, disabled, id],
	);

	const stateRef = useStateRef<ListboxRefState<ValueType>>({
		multiple: multiple === true,
		items: listboxItems,
		selection,
		focusedItem,
		setFocusedItem,
		setHoverItem,
		onSelect: ensureCallableFunction(onSelect),
		onFocus: ensureCallableFunction(onFocus),
		onBlur: ensureCallableFunction(onBlur),
		onMouseOut: ensureCallableFunction(onMouseOut),
		onKeyDown: ensureCallableFunction(onKeyDown),
		onActiveDescChange: ensureCallableFunction(onActiveDescChange),
		onCollapse: ensureCallableFunction(onCollapse),
	});

	const itemMouseOverHandler = useCallback(
		(item: ListItemConfig<ValueType>) => {
			setHoverItem(item.disabled ? undefined : item);
		},
		[],
	);

	const keyDownHandler = useKeyDownHandler(stateRef);

	const mouseOutHandler = useMouseOutHandler(stateRef);

	const focusHandler = useFocusHandler(stateRef);

	const blurHandler = useBlurHandler(stateRef);

	const selectionHandler = useSelectionHandler(stateRef);

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
			aria-activedescendant={focusedItem == null ? "" : focusedItem.id}
			aria-multiselectable={multiple || undefined}
		>
			{expanded
				? renderTree<ValueType, IsMultiple>(
						listboxItems,
						props,
						hoverItem,
						focusedItem,
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
	ListboxConditionalProps,
	ListboxItemTplProps,
};
