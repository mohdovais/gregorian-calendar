import { CalrityAngleRight } from "../icons/ClarityAngleRight";
import { ListGroup, ListItem, Listbox } from "../listbox";
import { ensureArray } from "../utils/array";
import { classname } from "../utils/classname";
import { hasKey } from "../utils/object";
import css from "./Menu.module.css";
import { useFloating } from "@floating-ui/react-dom";
import { createContext, forwardRef, useCallback } from "react";

type MenuItem<T> = ListItem<T> & {
	menu?: MenuGroupOrItem<T>[];
	keys?: string;
};

type MenuGroup<T> = Omit<ListGroup<T>, "items"> & {
	items: MenuItem<T>[];
};

type MenuGroupOrItem<T> = MenuItem<T> | MenuGroup<T>;

interface MenuProps<T> {
	id?: string;
	className?: string;
	style?: React.CSSProperties;
	show?: boolean;
	ref?: React.Ref<HTMLUListElement>;

	items: MenuGroupOrItem<T>[];
	onSelect?: (option: T) => void;
}

type OptionTplProps<T> = {
	item: MenuItem<T>;
	disabled: boolean;
	active: boolean;
};

function ItemTpl<T>(props: OptionTplProps<T>) {
	const { item, disabled, active } = props;
	const node = item;
	const hasMenu = hasKey(node, "menu");

	const open = !disabled && active;

	const { x, y, strategy, refs } = useFloating({
		open,
		placement: "right",
		strategy: "fixed",
	});

	return (
		<li className="menu">
			<div className={css.wrapper} ref={refs.setReference}>
				<div className={css.text}>{node.label}</div>
				{hasMenu ? (
					<CalrityAngleRight />
				) : hasKey(node, "keys") ? (
					<div>{node.keys as React.ReactNode}</div>
				) : null}
			</div>
			{hasMenu && open ? (
				<Listbox
					role="menu"
					itemRole="menuitem"
					id={item.id + "-menu"}
					className={css.menu}
					style={{
						willChange: "opacity",
						position: strategy,
						top: y ?? 0,
						left: x ?? 0,
					}}
					items={ensureArray(item.menu)}
					itemTpl={ItemTpl}
					onSelect={undefined}
					show={open}
					ref={refs.setFloating}
				/>
			) : null}
		</li>
	);
}

//const ItemTplMemo = memo(ItemTpl) as typeof ItemTpl;

// rome-ignore lint/suspicious/noExplicitAny: Generic
const MenuContext = createContext<((value: any) => void) | undefined>(
	undefined,
);

function Menu<T>(props: MenuProps<T>, ref?: React.Ref<HTMLUListElement>) {
	const { id, className, style, onSelect, items, show } = props;

	const onActiveDescendantChange = useCallback(
		(activeDescendant?: MenuItem<T>) => {
			console.log(activeDescendant);
		},
		[],
	);

	return (
		<Listbox
			role="menu"
			itemRole="menuitem"
			id={id}
			className={classname(css.menu, className)}
			style={style}
			items={items}
			itemTpl={ItemTpl}
			onSelect={onSelect}
			show={show}
			ref={ref}
			onActiveDescendantChange={onActiveDescendantChange}
		/>
	);
}

const MenuWithRef = forwardRef(Menu) as typeof Menu;

export { MenuWithRef as Menu };
export type { MenuProps, MenuGroup, MenuItem, MenuGroupOrItem };
