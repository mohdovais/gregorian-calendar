import { usePosition } from "../hooks/usePosition";
import { CalrityAngleRight } from "../icons/ClarityAngleRight";
import { ListGroup, ListItem, Listbox, ListboxProps } from "../listbox";
import { ListboxItemTplProps } from "../listbox";
import { ensureArray } from "../utils/array";
import { classname } from "../utils/classname";
import { hasKey } from "../utils/object";
import css from "./Menu.module.css";
import {
	createContext,
	forwardRef,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";

type MenuItem<T> = ListItem<T> & {
	menu?: MenuGroupOrItem<T>[];
	keys?: string;
};

type MenuGroup<T> = Omit<ListGroup<T>, "items"> & {
	items: MenuItem<T>[];
};

type MenuGroupOrItem<T> = MenuItem<T> | MenuGroup<T>;

function preventEvent(event: React.KeyboardEvent<HTMLElement>) {
	event.preventDefault();
	event.stopPropagation();
}

function itemTpl<T>(props: ListboxItemTplProps<T>) {
	return hasKey(props.item, "menu")
		? itemWithMenuTpl(props)
		: itemSimpleTpl(props);
}

function itemSimpleTpl<T>(props: ListboxItemTplProps<T>) {
	const { item } = props;

	return (
		<div className={css.wrapper}>
			<div className={css.text}>{item.label}</div>
			{hasKey(item, "keys") ? <div>{item.keys as React.ReactNode}</div> : null}
		</div>
	);
}

function itemWithMenuTpl<T>(props: ListboxItemTplProps<T>) {
	const { item, disabled } = props;

	const ref = useRef<HTMLLIElement>(null);
	const [keyboardOpen, setKeyboardOpen] = useState(false);

	const enabled = !disabled;
	const hasMenu = enabled && hasKey(item, "menu");
	const expanded = hasMenu && true; // (hover || keyboardOpen);
	const onSelect = useContext(MenuSelectContext);

	const { refs, style } = usePosition({
		show: expanded,
		settings: { position: "right" },
	});

	const itemKeyDownHandler = useCallback(
		(event: React.KeyboardEvent<HTMLLIElement>) => {
			if (event.key === "ArrowRight") {
				preventEvent(event);
				setKeyboardOpen(true);
			}
		},
		[],
	);

	const menuKeyDownHandler = useCallback(
		(event: React.KeyboardEvent<HTMLUListElement>) => {
			if (event.key === "ArrowLeft" || event.key === "Escape") {
				preventEvent(event);
				setKeyboardOpen(false);
				ref.current?.focus();
			}
		},
		[],
	);

	useEffect(() => {
		if (keyboardOpen && refs.floating) {
			refs.floating.focus();
		}
	}, [keyboardOpen, refs.floating]);

	console.log(style);

	return (
		<li onKeyDown={hasMenu ? itemKeyDownHandler : undefined} ref={ref}>
			<div className={css.wrapper} ref={refs.setReference}>
				<div className={css.text}>{item.label}</div>
				<CalrityAngleRight />
			</div>
			{expanded ? (
				<Listbox
					ref={refs.setFloating}
					role="menu"
					itemRole="menuitem"
					id={item.id + "-menu"}
					className={css.menu}
					style={style}
					items={ensureArray(item.menu as MenuGroupOrItem<T>)}
					itemTpl={itemTpl}
					expanded={expanded}
					onKeyDown={menuKeyDownHandler}
					onSelect={onSelect}
				/>
			) : null}
		</li>
	);
}

// rome-ignore lint/suspicious/noExplicitAny: Generic
const MenuSelectContext = createContext<((value: any) => void) | undefined>(
	undefined,
);

type MenuProps<T> = Omit<
	ListboxProps<T, false>,
	"multiple" | "role" | "itemRole" | "itemTpl"
>;

function Menu<T>(props: MenuProps<T>, ref?: React.Ref<HTMLUListElement>) {
	const { className, onSelect, ...listboxProps } = props;

	return (
		<MenuSelectContext.Provider value={onSelect}>
			<Listbox
				{...listboxProps}
				className={classname(css.menu, className)}
				role="menu"
				itemRole="menuitem"
				itemTpl={itemTpl}
				ref={ref}
			/>
		</MenuSelectContext.Provider>
	);
}

const MenuWithRef = forwardRef(Menu) as typeof Menu;

export { MenuWithRef as Menu };
export type { MenuProps, MenuGroup, MenuItem, MenuGroupOrItem };
