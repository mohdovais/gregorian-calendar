import { JSX, useId } from "react";
import css from "./menu-button.module.css";
import { classNames } from "../utils/string";

type MenuGroupProps = {
	id?: string;
	className?: string;
	label?: string | React.ReactElement;
	children: React.ReactElement | React.ReactElement[];
};

function MenuGroup(props: MenuGroupProps): JSX.Element {
	const { children, className, id, label } = props;
	const labelId = useId();
	return (
		<div
			role="group"
			id={id}
			className={className}
			aria-labelledby={labelId}
		>
			<div
				role="presentation"
				className={classNames(css.group_label)}
				id={labelId}
			>
				{label}
			</div>
			{children}
		</div>
	);
}

export { MenuGroup };
export type { MenuGroupProps };
