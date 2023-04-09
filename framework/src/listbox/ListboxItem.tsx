import { classname } from "../utils/classname";
import { ListItemConfig, preventEvent } from "./utils";
import css from "./Listbox.module.css";
import { createElement, isValidElement, memo } from "react";
import { isFunction, noop } from "../utils/function";

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
	ItemTpl?: (props: ItemTplProps<T>) => JSX.Element;
	onSelect?: (selection: ListItemConfig<T>) => void;
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
		ItemTpl,
		role,
		onSelect = noop,
	} = props;

	return (
		// rome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<li
			id={id}
			className={classname(
				css.listitem,
				disabled && css.disabled,
				selected && css.selected,
				active && css.active,
				className,
			)}
			role={role}
			aria-disabled={disabled || undefined}
			aria-selected={disabled ? undefined : selected}
			tabIndex={disabled ? undefined : -1}
			onClick={
				disabled
					? undefined
					: (event) => {
							preventEvent(event);
							onSelect(item);
					  }
			}
			onFocus={preventEvent}
		>
			{ItemTpl != null ? (
				<ItemTpl
					item={item}
					selected={selected}
					multiple={multiple}
					disabled={disabled}
					active={active}
				/>
			) : (
				item.label
			)}
		</li>
	);
}

const ListboxItemMemo = memo(ListboxItem) as typeof ListboxItem;

export { ListboxItemMemo as ListboxItem };
export type { ListboxItemProps };
