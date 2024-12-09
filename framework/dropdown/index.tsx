import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ResultStyle, usePosition } from "../hooks/usePosition";
import { Portal } from "../portal";
import { ensureArray } from "../utils/array";
import { classname } from "../utils/classname";
import { Listbox, ListboxProps } from "../listbox2";
import {
	ensureItemsWithId,
	getActionFromKey,
	getFirstSelectedIndex,
	getUpdatedIndex,
	scrollSelectedIntoView,
	SelectAction_Close,
	SelectAction_CloseSelect,
	SelectAction_First,
	SelectAction_Last,
	SelectAction_Next,
	SelectAction_Open,
	SelectAction_PageDown,
	SelectAction_PageUp,
	SelectAction_Previous,
	SelectAction_Type,
} from "./dropdown.helpers";
import css from "./dropdown.module.css";
import { isFunction } from "../utils/function";

const positionSettings = {
	transform: (css: ResultStyle, target: HTMLElement) => {
		const draft = Object.assign({}, css);
		const { top, left, maxHeight } = draft;
		if (top != null && top !== 0) {
			draft.top = top - 58;
		}

		if (left != null && left !== 0) {
			draft.left = left - 10;
		}

		if (maxHeight != null) {
			draft.maxHeight = maxHeight + 48;
		}

		// @ts-expect-error
		draft.width = target.offsetWidth + 20;
		return draft;
	},
};

const icon = (
	<svg
		viewBox="0 0 16 16"
		width="16"
		height="16"
		focusable={false}
		className={css.icon}
	>
		<path fill="currentColor" d="M3 5v1l5 5 5-5V5H3z" />
	</svg>
);

type DisplayComponentProps = {};

interface DropdownProps<T> extends ListboxProps<T> {
	name?: string;
	label: string;
	required?: boolean;
	readonly?: boolean;
	displayComponent?: React.Component<DisplayComponentProps>;
}

function Dropdown<T>(props: DropdownProps<T>) {
	const {
		label,
		className,
		disabled,
		displayComponent,
		id,
		multiple = false,
		name,
		onChange,
		readonly,
		required,
		style,
		value,
	} = props;

	const [expanded, setExpanded] = useState(false);
	const listboxId = useId();
	const labelId = useId();
	const position = usePosition(expanded, positionSettings);
	const { items, flatItems } = useMemo(() => ensureItemsWithId(props.items), [
		props.items,
	]);
	const [activeIndex, setActiveIndex] = useState(-1);

	const values = ensureArray(props.value);
	const selectedIndex = getFirstSelectedIndex(flatItems, values);

	const onBlur = (event: React.FocusEvent<HTMLElement>) => {
		const target = event.relatedTarget;
		const { floating, reference } = position.refs;
		if (
			reference?.contains(target) || floating?.contains(target)
		) {
			return;
		}
		//setExpanded(false);
	};

	const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
		const action = getActionFromKey(event, expanded);

		switch (action) {
			case SelectAction_Last:
			case SelectAction_First:
				setExpanded(true);
			// intentional fallthrough
			case SelectAction_Next:
			case SelectAction_Previous:
			case SelectAction_PageUp:
			case SelectAction_PageDown:
				event.preventDefault();
				setActiveIndex((activeIndex) =>
					getUpdatedIndex(activeIndex, flatItems.length - 1, action)
				);
				break;
			case SelectAction_CloseSelect:
				const v = flatItems[activeIndex].value;
				if (isFunction(onChange) && v != null) {
					onChange(v);
				}
			// intentional fallthrough
			case SelectAction_Close:
				event.preventDefault();
				return setExpanded(false);
			case SelectAction_Type:
				// tbd return this.onComboType(key);
			case SelectAction_Open:
				event.preventDefault();
				return setExpanded(true);
		}
	};

	useEffect(() => {
		const root = position.refs.floating;
		if (expanded && activeIndex !== -1 && root != null) {
			const id = "#" + flatItems[activeIndex].id;
			const activeEl = root.querySelector(id);

			if (activeEl != null) {
				setTimeout(
					() =>
						activeEl.scrollIntoView({
							behavior: "smooth",
							block: "center",
						}),
					100,
				);
			}
		}
	}, [activeIndex, expanded, flatItems]);

	return (
		<div
			id={id}
			className={classname(
				css.wrapper,
				expanded ? css.expanded : css.collapsed,
				className,
			)}
			style={style}
			ref={position.refs.setReference}
			onBlur={onBlur}
			onKeyDown={onKeyDown}
		>
			<input
				name={name}
				type="hidden"
				required={required}
				value={values.join(",")}
			/>
			<button
				type="button"
				className={classname(
					css.input,
					values.length > 0 && css.has_value,
					required && css.required,
					readonly && css.readonly,
					disabled && css.disabled,
				)}
				role="combobox"
				aria-labelledby={labelId}
				aria-controls={listboxId}
				aria-expanded={expanded}
				aria-activedescendant={expanded
					? (flatItems[activeIndex]?.id)
					: undefined}
				onClick={() => setExpanded((x) => !x)}
			>
				<span>{values.join(",")}</span>
			</button>
			<label id={labelId} className={css.label}>{label}</label>
			{icon}
			<Portal>
				{expanded
					? (
						<div
							className={css.picker}
							style={position.style}
							ref={position.refs.setFloating}
							onBlur={onBlur}
						>
							<div className={css.scroller}>
								<Listbox
									items={items}
									id={listboxId}
									activeItemId={flatItems[activeIndex]?.id}
									multiple={multiple}
									value={value}
									onChange={onChange}
								/>
							</div>
						</div>
					)
					: null}
			</Portal>
		</div>
	);
}

export { Dropdown };
