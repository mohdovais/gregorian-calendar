import React from "react";
import { classname } from "../utils/classname";
import { headlessListbox } from "./Listbox.store";
import style from "./ListboxItem.module.css";

type ListboxProps<T> = {
	className?: string;
	id?: string;
	children?: React.ReactElement | React.ReactElement[];
	value?: T;
	onChange?: (value: T) => void;
};

function Listbox<T>(props: ListboxProps<T>) {
	const { className, id, onChange, value } = props;
	const { activeId, items, eventListeners } = headlessListbox(
		props.children,
		value,
		onChange,
	);

	return (
		<div
			id={id}
			className={classname(className, style.listbox)}
			role="listbox"
			tabIndex={0}
			aria-activedescendant={activeId}
			{...eventListeners}
		>
			{items}
		</div>
	);
}

export { Listbox };
