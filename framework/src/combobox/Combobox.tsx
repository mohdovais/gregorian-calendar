import { useState } from "react";
import { useEnsuredId } from "../hooks/useId";
import { usePosition } from "../hooks/usePosition";
import inputCss from "../input/Input.module.css";
import { headlessListbox } from "../listbox/Listbox.store";
import { SearchableListbox } from "../listbox/SearchableListbox";
import { Portal } from "../portal";
import { classname } from "../utils/classname";
import css from "./Combobox.module.css";

interface ComboboxProps<T> {
	collapseOnSelect?: boolean;
	delimiter?: string;
	id?: string;
	className?: string;
	multiselect?: boolean;
	value?: T;
	children?: React.ReactElement | React.ReactElement[];
	onChange?: (selection: T) => void;
}

function Combobox<T>(props: ComboboxProps<T>) {
	const { className, id, children, value, onChange } = props;
	const [expanded, setExpanded] = useState(false);
	const { style, refs } = usePosition(expanded);
	const { activeId, items, eventListeners } = headlessListbox(
		children,
		null,
		onChange,
	);

	const listboxId = useEnsuredId("listbox-", id);

	return (
		<>
			<button
				type="button"
				className={classname(inputCss.field, css.field, className)}
				ref={refs.setReference}
				aria-haspopup={true}
				role="combobox"
				aria-controls={listboxId}
				aria-expanded={expanded}
				aria-activedescendant={activeId}
				onKeyDown={expanded ? eventListeners.onKeyDown : undefined}
				onClick={() => {
					setExpanded((expanded) => !expanded);
				}}
			>
				{value == null ? null : String(value)}
			</button>
			<Portal>
				<div ref={refs.setFloating} style={style}>
					{expanded ? (
						<SearchableListbox id={listboxId} className={css.menu}>
							{items}
						</SearchableListbox>
					) : null}
				</div>
			</Portal>
		</>
	);
}

export { Combobox };
