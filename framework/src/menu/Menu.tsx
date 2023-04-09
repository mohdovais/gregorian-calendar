import {
	createContext,
	forwardRef,
	memo,
	useCallback,
	useContext,
	useRef,
	useState,
} from "react";
import { CalrityAngleRight } from "../icons/ClarityAngleRight";
import { ListGroup, ListItem, Listbox } from "../listbox";
import { Portal } from "../portal";
import { classname } from "../utils/classname";
import { hasKey } from "../utils/object";
import css from "./Menu.module.css";
import { useFloating } from "@floating-ui/react-dom";

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
};

function OptionTpl<T>(props: OptionTplProps<T>) {
	const { item, disabled } = props;
	const node = item;
	const hasMenu = hasKey(node, "menu");
	const shouldNotListen = disabled || !hasMenu;
	const [open, setOpen] = useState(false);

	console.log(props);

	const { x, y, strategy, refs } = useFloating({
		open,
		placement: "right",
	});

	return (
		<div
			className={css.wrapper}
			onMouseOver={shouldNotListen ? undefined : () => setOpen(true)}
			onMouseOut={shouldNotListen ? undefined : () => setOpen(false)}
			onFocus={shouldNotListen ? undefined : () => setOpen(true)}
			onBlur={shouldNotListen ? undefined : () => setOpen(false)}
			ref={refs.setReference}
		>
			<div className={css.text}>{node.label}</div>
			{hasMenu ? (
				<CalrityAngleRight />
			) : hasKey(node, "keys") ? (
				<div>{node.keys as React.ReactNode}</div>
			) : null}

			{hasMenu && open ? (
				<Listbox
					role="menu"
					itemRole="menuitem"
					id={item.id + "-menu"}
					className={css.menu}
					style={{
						position: strategy,
						top: y ?? 0,
						left: x ?? 0,
					}}
					items={item.menu}
					ItemTpl={OptionTplMemo}
					onSelect={undefined}
					show={open}
					ref={refs.setFloating}
				/>
			) : null}
		</div>
	);
}

const OptionTplMemo = memo(OptionTpl) as typeof OptionTpl;

// rome-ignore lint/suspicious/noExplicitAny: Generic
const MenuContext = createContext<((value: any) => void) | undefined>(
	undefined,
);

function Menu<T>(props: MenuProps<T>, ref?: React.Ref<HTMLUListElement>) {
	const { id, className, style, onSelect, items, show } = props;

	return (
		<Listbox
			role="menu"
			itemRole="menuitem"
			id={id}
			className={classname(css.menu, className)}
			style={style}
			items={items}
			ItemTpl={OptionTplMemo}
			onSelect={onSelect}
			show={show}
			ref={ref}
		/>
	);
}

const MenuWithRef = forwardRef(Menu) as typeof Menu;

export { MenuWithRef as Menu };
export type { MenuProps, MenuGroup, MenuItem, MenuGroupOrItem };
