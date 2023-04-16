import { CalrityAngleRight } from "../icons/ClarityAngleRight";
import { ListGroup, ListItem, Listbox, ListboxProps } from "../listbox";
import { ListboxItemTplProps } from "../listbox";
import { ensureArray } from "../utils/array";
import { classname } from "../utils/classname";
import { hasKey } from "../utils/object";
import css from "./Menu.module.css";
import { useFloating } from "@floating-ui/react-dom";
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
	const { item, disabled, hover } = props;

	const ref = useRef<HTMLLIElement>(null);
	const [keyboardOpen, setKeyboardOpen] = useState(false);

	const enabled = !disabled;
	const hasMenu = enabled && hasKey(item, "menu");
	const expand = hasMenu && (hover || keyboardOpen);
	const onSelect = useContext(MenuSelectContext);

	const { x, y, strategy, refs } = useFloating({
		open: expand,
		placement: "right",
		strategy: "fixed",
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
		if (keyboardOpen && refs.floating.current) {
			refs.floating.current.focus();
		}
	}, [keyboardOpen, refs.floating.current]);

	return (
		<li onKeyDown={hasMenu ? itemKeyDownHandler : undefined} ref={ref}>
			<div className={css.wrapper} ref={refs.setReference}>
				<div className={css.text}>{item.label}</div>
				{hasMenu ? (
					<CalrityAngleRight />
				) : hasKey(item, "keys") ? (
					<div>{item.keys as React.ReactNode}</div>
				) : null}
			</div>
			{expand ? (
				<Listbox
					ref={refs.setFloating}
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
					items={ensureArray(item.menu as MenuGroupOrItem<T>)}
					itemTpl={itemTpl}
					expanded={expand}
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
