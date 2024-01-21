import React from "react";
import { useEnsuredId } from "../hooks/useId";
import { Input } from "../input";
import { classname } from "../utils/classname";
import { isFunction } from "../utils/function";
import { headlessListbox } from "./Listbox.store";
import listboxItemCss from "./ListboxItem.module.css";
import css from "./SearchableListbox.module.css";

type SearchableListboxProps<T> = {
	className?: string;
	id?: string;
	children?: React.ReactElement | React.ReactElement[];
	value?: T;
	placeholder?: string;
	onSearch?: (query: string) => void;
	onChange?: (value: T) => void;
};

function SearchableListbox<T>(props: SearchableListboxProps<T>) {
	const { className, onChange, onSearch, value, placeholder } = props;
	const { activeId, items, eventListeners } = headlessListbox(
		props.children,
		value,
		onChange,
	);
	const id = useEnsuredId("combo-", props.id);
	const listboxId = `${id}-listbox`;

	return (
		<div className={classname(css.wrapper, listboxItemCss.listbox, className)}>
			<div className={css.input_wrapper}>
				<Input
					type="search"
					id={id}
					className={css.input}
					autoComplete="false"
					role="combobox"
					aria-autocomplete="list"
					aria-haspopup="listbox"
					aria-expanded="true"
					placeholder={placeholder}
					aria-controls={listboxId}
					aria-activedescendant={activeId}
					{...eventListeners}
					onChange={(event) =>
						isFunction(onSearch) && onSearch(event.target.value)
					}
				/>
			</div>
			<div
				id={listboxId}
				role="listbox"
				tabIndex={-1}
				aria-activedescendant={activeId}
			>
				{items}
			</div>
		</div>
	);
}

export { SearchableListbox };
