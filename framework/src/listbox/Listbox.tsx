import { createRandomId, useEnsuredId, useId } from "../hooks/useId";
import { getNextItem, getPreviousItem } from "../utils/array";
import { classname } from "../utils/classname";
import css from "./Listbox.module.css";
import { initializer, store } from "./store";
import {
	useCallback,
	useEffect,
	useMemo,
	useReducer,
	useRef,
	useState,
} from "react";

interface ListboxProps<T> {
	id?: string;
	className?: string;
	style?: React.CSSProperties;
	options: T[];
	optionClassName?: string;
	value?: T;
	displayField?: keyof T;
	displayTpl?: (value: T) => JSX.Element | string;
	onChange?: (newValue: T, oldValue: T, props: ListboxProps<T>) => void;
	onSelection?: (selection: T, props: ListboxProps<T>) => void;
}

type Item = { id: string; display: string | JSX.Element };
type Self = {
	activeDescendant: string;
	items: Item[];
};

function Listbox<T>(props: ListboxProps<T>) {
	const {
		options,
		className,
		style,
		displayField,
		displayTpl,
		onChange,
		onSelection,
		value,
		optionClassName,
	} = props;

	const id = useEnsuredId("listbox-", props.id);
	const [activeDescendant, setActiveDescendant] = useState("");

	const effectiveDisplayTpl = useCallback(
		(value: T) => {
			return typeof displayTpl === "function"
				? displayTpl(value)
				: displayField == null
				? typeof value === "object"
					? JSON.stringify(value)
					: String(value)
				: String(value[displayField]);
		},
		[displayTpl, displayField],
	);

	const items = useMemo(() => {
		return options.map((item) => ({
			id: id + "-" + createRandomId("option-"),
			value: item,
			display: effectiveDisplayTpl(item),
		}));
	}, [options, effectiveDisplayTpl, id]);

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLDivElement>) => {
			var key = event.key;
			const { activeDescendant, items } = selfRef.current;
			var currentItem =
				items.find((item) => item.id === activeDescendant) || items[0];
			var nextItem = currentItem;

			if (!currentItem) {
				return;
			}

			switch (key) {
				case "ArrowUp":
					if (activeDescendant === "") {
						setActiveDescendant(currentItem.id);
						break;
					}
					nextItem = getPreviousItem(items, currentItem)!;
					event.preventDefault();
					setActiveDescendant(nextItem.id);
					break;

				case "ArrowDown":
					if (activeDescendant === "") {
						setActiveDescendant(currentItem.id);
						break;
					}
					nextItem = getNextItem(items, currentItem)!;
					event.preventDefault();
					setActiveDescendant(nextItem.id);

					break;
				case "Home":
					event.preventDefault();
					setActiveDescendant(items[0].id);

					break;
				case "End":
					event.preventDefault();
					setActiveDescendant(items[items.length - 1].id);

					break;
			}
		},
		[],
	);

	useEffect(() => {
		const el = document.getElementById(activeDescendant);
		if (el !== null) {
			el.scrollIntoView({ behavior: "smooth" });
		}
	}, [activeDescendant]);

	useEffect(() => {
		const id = items.find((x) => x.value === value)?.id;
		console.log(id);

		if (id != null) {
			const el = document.getElementById(id);
			if (el !== null) {
				el.scrollIntoView({ behavior: "smooth" });
			}
		}
	}, [items, value]);

	const selfRef = useRef<Self>({ activeDescendant: "", items: [] });
	selfRef.current.activeDescendant = activeDescendant;
	selfRef.current.items = items;

	return (
		<div
			id={id}
			className={classname(css.listbox, className)}
			style={style}
			role="listbox"
			tabIndex={0}
			aria-labelledby=""
			aria-activedescendant={activeDescendant}
			aria-multiselectable="false"
			onFocus={undefined}
			onKeyDown={handleKeyDown}
		>
			{items.map((item) => {
				return (
					<div
						key={item.id}
						role="option"
						id={item.id}
						className={classname(
							css.option,
							optionClassName,
							item.id === activeDescendant && css.focused,
							item.value === value && css.selected,
						)}
						aria-selected={item.value === value || undefined}
						onClick={undefined}
						onKeyDown={undefined}
					>
						{item.display}
					</div>
				);
			})}
		</div>
	);
}

export { Listbox };
