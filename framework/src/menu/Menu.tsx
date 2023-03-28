import { CalrityAngleRight } from "../icons/ClarityAngleRight";
import { OptGroup, Option, OptionList } from "../option-list";
import { classname } from "../utils/classname";
import { hasKey } from "../utils/object";
import css from "./Menu.module.css";

type MenuItem<T> = Option<T> & {
	more?: MenuGroupOrItem<T>[];
	keys?: string;
};

type MenuGroup<T> = Omit<OptGroup<T>, "options"> & {
	options: MenuItem<T>[];
};

type MenuGroupOrItem<T> = MenuItem<T> | MenuGroup<T>;

interface MenuProps<T> {
	id?: string;
	className?: string;
	style?: React.CSSProperties;

	items: MenuGroupOrItem<T>[];
	onMouseOver?: (option: T) => void;
	onClick?: (option: T) => void;
}

function optionTpl<T>(node: MenuItem<T>) {
	return (
		<div className={css.wrapper}>
			<div className={css.text}>{node.label}</div>
			{hasKey(node, "more") ? (
				<CalrityAngleRight />
			) : hasKey(node, "keys") ? (
				<div>{node.keys as React.ReactNode}</div>
			) : null}
		</div>
	);
}

function Menu<T>(props: MenuProps<T>) {
	const { className, style, onClick, onMouseOver, items } = props;

	return (
		<OptionList
			role="menu"
			className={classname(css.menu, className)}
			style={style}
			options={items}
			optionTpl={optionTpl}
			onSelection={onClick}
			onMouseOver={onMouseOver}
		/>
	);
}

export { Menu };
export type { MenuProps, MenuGroup, MenuItem, MenuGroupOrItem };
