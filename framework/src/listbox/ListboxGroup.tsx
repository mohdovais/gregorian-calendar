import { useId } from "react";

type ListboxGroupProps = {
	disabled?: boolean;
	label?: string;
	children: React.ReactElement | React.ReactElement[];
};

function ListboxGroup(props: ListboxGroupProps) {
	const id = useId();
	return (
		<div role="group" aria-labelledby={id}>
			<div role="presentation" id={id}>
				{props.label}
			</div>
			{props.children}
		</div>
	);
}

export { ListboxGroup };
export type { ListboxGroupProps };
