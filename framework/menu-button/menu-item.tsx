import { JSX } from "react";
import { isFunction } from "../utils/function";
import { classNames } from "../utils/string";
import css from "./menu-button.module.css";

type MenuItemProps<T> = {
	id?: string;
	className?: string;
	disabled?: boolean;
	value: T;
	children?: React.ReactNode;
	__active?: boolean;
	__checked?: boolean;
	__onClick?: (value: T) => void;
};

function MenuItem<T>(props: MenuItemProps<T>): JSX.Element {
	const {
		children,
		className,
		disabled,
		id,
		value,
		__active,
		__checked,
		__onClick,
	} = props;

	return (
		<div
			id={id}
			className={classNames(
				css.option,
				__active && css.active,
				__checked && css.selected,
				className,
			)}
			role="menuitem"
			aria-checked={__checked || undefined}
			aria-disabled={disabled || undefined}
			aria-current={__active || undefined}
			onClick={!disabled && isFunction(__onClick)
				? () => {
					__onClick(value);
				}
				: undefined}
		>
			{children}
		</div>
	);
}

export { MenuItem };
export type { MenuItemProps };
