import { useState } from "react";
import { CalrityAngleRight } from "../icons/ClarityAngleRight";
import { OptGroup, Option, Listbox } from "../listbox";
import { Portal } from "../portal";
import { classname } from "../utils/classname";
import { hasKey } from "../utils/object";
import css from "./Menu.module.css";
import { useFloating } from "@floating-ui/react-dom";

type MenuItem<T> = Option<T> & {
	more?: MenuGroupOrItem<T>[];
	keys?: string;
};

type MenuGroup<T> = Omit<OptGroup<T>, "items"> & {
	items: MenuItem<T>[];
};

type MenuGroupOrItem<T> = MenuItem<T> | MenuGroup<T>;

interface MenuProps<T> {
	id?: string;
	className?: string;
	style?: React.CSSProperties;

	items: MenuGroupOrItem<T>[];
	onSelect?: (option: T) => void;
}

type OptionTplProps<T> = {
	item: MenuItem<T>;
};

function OptionTpl<T>(props: OptionTplProps<T>) {
	const node = props.item;
	const more = hasKey(node, "more");
	const [open, setOpen] = useState(false);

	const { x, y, strategy, refs } = useFloating({
		open,
		placement: "right",
	});

	return (
		<div
			className={css.wrapper}
			onMouseOver={() => setOpen(true)}
			onMouseOut={() => setOpen(false)}
			onFocus={() => setOpen(true)}
			onBlur={() => setOpen(false)}
			ref={refs.setReference}
		>
			<div className={css.text}>{node.label}</div>
			{more ? (
				<CalrityAngleRight />
			) : hasKey(node, "keys") ? (
				<div>{node.keys as React.ReactNode}</div>
			) : null}

			{more && open ? (
				<Portal>
					<div
						ref={refs.setFloating}
						style={{
							position: strategy,
							top: y ?? 0,
							left: x ?? 0,
						}}
					>
						{/* rome-ignore lint/style/noNonNullAssertion: verified */}
						<Menu items={node.more!} />
					</div>
				</Portal>
			) : null}
		</div>
	);
}

function Menu<T>(props: MenuProps<T>) {
	const { id, className, style, onSelect, items } = props;

	return (
		<Listbox
			role="menu"
			itemRole="menuitem"
			id={id}
			className={classname(css.menu, className)}
			style={style}
			items={items}
			ItemTpl={OptionTpl}
			onSelect={onSelect}
		/>
	);
}

export { Menu };
export type { MenuProps, MenuGroup, MenuItem, MenuGroupOrItem };
