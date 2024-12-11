import { useId } from "react";
import css from "./Listbox.module.css";

type ListboxGroupProps = {
	id?: string;
	label?: string | React.ReactElement;
	children: React.ReactElement | React.ReactElement[];
};

function ListboxGroup(props: ListboxGroupProps) {
	const id = useId();
	return (
		<div role="group" aria-labelledby={id}>
			<div role="presentation" className={css.group_label} id={id}>
				{props.label}
			</div>
			{props.children}
		</div>
	);
}

export { ListboxGroup };
export type { ListboxGroupProps };
