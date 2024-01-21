import { classname } from "../utils/classname";
import style from "./ListboxItem.module.css";

type ListboxItemProps<T> = {
	className?: string;
	id?: string;
	value: T;
	active?: boolean;
	selected?: boolean;
	disabled?: boolean;
	children?: string | React.ReactElement;
	onClick?: ((value: T) => void) | ((value: T) => boolean);
};

function ListboxItem<T>(props: ListboxItemProps<T>) {
	const {
		active,
		children,
		className,
		disabled,
		id,
		onClick,
		selected,
		value,
	} = props;

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<div
			id={id}
			className={classname(
				className,
				style.option,
				active && style.active,
				selected && style.selected,
			)}
			role="option"
			aria-selected={selected || undefined}
			aria-disabled={disabled}
			aria-current={active || undefined}
			onClick={() => {
				typeof onClick === "function" && onClick(value);
			}}
		>
			{children}
		</div>
	);
}

export { ListboxItem };
export type { ListboxItemProps };
