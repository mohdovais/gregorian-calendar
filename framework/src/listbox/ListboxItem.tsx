import { classname } from "../utils/classname";
import { isFunction, noop } from "../utils/function";
import css from "./Listbox.module.css";
import { ListItemConfig, preventEvent } from "./utils";
import { cloneElement, isValidElement, memo } from "react";

type HTMLLIAttributes = React.LiHTMLAttributes<HTMLLIElement>;

type ItemTplProps<T> = {
	item: ListItemConfig<T>;
	selected: boolean;
	multiple: boolean;
	disabled: boolean;
	active: boolean;
};

type ListboxItemProps<T> = {
	id: string;
	role: string;
	disabled: boolean;
	selected: boolean;
	active: boolean;
	multiple: boolean;
	className?: string;
	item: ListItemConfig<T>;
	itemTpl?: (props: ItemTplProps<T>) => JSX.Element;
	onSelect?: (selection: ListItemConfig<T>) => void;
	onMouseOver?: (item: ListItemConfig<T>) => void;
};

function ListboxItem<T>(props: ListboxItemProps<T>) {
	const {
		id,
		item,
		active,
		disabled,
		selected,
		multiple,
		className,
		itemTpl,
		role,
		onSelect = noop,
		onMouseOver = noop,
	} = props;

	const liProps: HTMLLIAttributes = {
		id,
		className: classname(
			css.listitem,
			disabled && css.disabled,
			selected && css.selected,
			active && css.active,
			className,
		),
		role,
		"aria-disabled": disabled || undefined,
		"aria-selected": disabled ? undefined : selected,
		tabIndex: disabled ? undefined : -1,
		onClick: disabled
			? undefined
			: (event) => {
					preventEvent(event);
					onSelect(item);
			  },
		onFocus: preventEvent,
		onMouseOver: () => onMouseOver(item),
	};

	const jsxElement = isFunction(itemTpl)
		? itemTpl({ item, selected, multiple, disabled, active })
		: undefined;

	if (
		jsxElement !== undefined &&
		isValidElement(jsxElement) &&
		jsxElement.type === "li"
	) {
		// @TODO merge props
		//const { children, ...customProps } = jsxElement.props as HTMLLIAttributes;
		return cloneElement(jsxElement, liProps);
	}

	return (
		<li {...liProps}>{jsxElement === undefined ? item.label : jsxElement}</li>
	);
}

const ListboxItemMemo = memo(ListboxItem) as typeof ListboxItem;

export { ListboxItemMemo as ListboxItem };
export type { ListboxItemProps };
