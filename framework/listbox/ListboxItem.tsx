import { isFunction } from "../utils/function";
import { classNames } from "../utils/string";
import css from "./Listbox.module.css";

type ListboxItemProps<T> = {
	className?: string;
	id?: string;
	value: T;
	active?: boolean;
	selected?: boolean;
	disabled?: boolean;
	children?: string | React.ReactElement;
	onClick?: (value: T) => void;
};

function ListboxItem<T>(props: ListboxItemProps<T>) {
	const {
		active,
		children,
		className,
		disabled,
		id,
		selected,
		value,
		onClick,
	} = props;

	return (
		<div
			id={id}
			className={classNames(
				css.option,
				active && css.active,
				selected && css.selected,
				className,
			)}
			role="option"
			aria-selected={selected || undefined}
			aria-disabled={disabled || undefined}
			aria-current={active || undefined}
			onClick={!disabled && isFunction(onClick)
				? () => {
					onClick(value);
				}
				: undefined}
		>
			{children}
		</div>
	);
}

export { ListboxItem };
export type { ListboxItemProps };
