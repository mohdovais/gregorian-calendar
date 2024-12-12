import { useId } from "react";
import { classname } from "../utils/classname";
import css from "./Listbox.module.css";

type ListboxGroupProps = {
	id?: string;
	className?: string;
	label?: string | React.ReactElement;
	children: React.ReactElement | React.ReactElement[];
};

function ListboxGroup(props: ListboxGroupProps) {
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
				className={classname(css.group_label)}
				id={labelId}
			>
				{label}
			</div>
			{children}
		</div>
	);
}

export { ListboxGroup };
export type { ListboxGroupProps };
