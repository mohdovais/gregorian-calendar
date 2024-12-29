import { useDeferredValue, useEffect, useReducer, useRef } from "react";
import { Portal } from "../portal";
import { ensureArray } from "../utils/array";
import { Listbox, ListboxProps } from "../listbox";
import { isFunction } from "../utils/function";
import { Search } from "../search";
import {
	DROPDOWN_ACTION_TYPE_Close,
	DROPDOWN_ACTION_TYPE_Open,
	DROPDOWN_ACTION_TYPE_Search,
	DROPDOWN_ACTION_TYPE_UpdateItems,
	DropdownAction,
	DropdownState,
	dropdownStore,
	getActionFromKeyboardEvent,
	initDropdownState,
} from "./dropdown.store";

import css from "./dropdown.module.css";
import { classNames } from "../utils/string";
import { useFloating } from "./useFloating";
import { ConditionalRender } from "../conditional-render";
import { ProxyFormInput } from "../proxy-form-input";

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

const deafultEmptySearchMessage = (
	<div>
		Your search did not match any items.
		<ul>
			<li>
				Make sure that all words are spelled correctly.
			</li>
			<li>Try different keywords.</li>
		</ul>
	</div>
);

interface DropdownProps<T> extends ListboxProps<T> {
	name?: string;
	label: string;
	required?: boolean;
	readonly?: boolean;
	displayTpl?: (selection: T[]) => React.ReactElement | string;
	searchPlaceholder?: string;
	searchEmptyMessage?: React.ReactElement | string;
	onSearch?: (search: string) => void;
}

const defaultDisplayTpl = (selection: unknown[]) => selection.join(", ");

function Dropdown<T>(props: DropdownProps<T>) {
	const {
		label,
		id,
		className,
		disabled,
		displayTpl = defaultDisplayTpl,
		multiple = false,
		name,
		onChange,
		readonly,
		required,
		style,
		value,
		searchEmptyMessage = deafultEmptySearchMessage,
		searchPlaceholder = "Search",
		onSearch,
	} = props;

	const hasSearch = isFunction(onSearch);
	const searchRef = useRef<HTMLInputElement>(null);

	const [state, dispatch] = useReducer<
		DropdownState<T>,
		null,
		[action: DropdownAction<T>]
	>(
		dropdownStore,
		null,
		initDropdownState,
	);

	const {
		activeIndex,
		expanded,
		flatItems,
		items,
		labelId,
		listboxId,
		searchId,
	} = state;

	const search = useDeferredValue(state.search);

	const {
		reference,
		floating,
		setFloating,
		setReference,
		floatingStyle,
		placement,
	} = useFloating(expanded);

	const values = ensureArray(props.value);

	const onBlur = (event: React.FocusEvent<HTMLElement>) => {
		const target = event.relatedTarget;
		if (
			reference?.contains(target) || floating?.contains(target)
		) {
			return;
		}

		dispatch({ type: DROPDOWN_ACTION_TYPE_Close });
	};

	const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
		const action = getActionFromKeyboardEvent(
			event,
			expanded,
			values,
			onChange,
		);

		dispatch(action);
	};

	useEffect(() => {
		dispatch({
			type: DROPDOWN_ACTION_TYPE_UpdateItems,
			items: props.items,
		});
	}, [props.items]);

	useEffect(() => {
		if (expanded && hasSearch) {
			onSearch(search);
		}
	}, [expanded, hasSearch, search]);

	/* MAGIC */
	useEffect(() => {
		if (state.event != null) {
			state.event();
			delete state.event;
		}

		if (state.effect != null) {
			state.effect();
			delete state.effect;
		}

		if (state.focusDropdown) {
			reference?.focus({
				preventScroll: true,
			});
			delete state.focusDropdown;
		}

		if (state.focusSearch) {
			searchRef.current?.focus({
				preventScroll: true,
				// @ts-expect-error
				focusVisible: true,
			});
			delete state.focusSearch;
		}
	}, [
		reference,
		state.effect,
		state.focusDropdown,
		state.event,
		state.focusSearch,
	]);

	return (
		<div
			id={id}
			className={classNames(
				css.dropdown,
				expanded ? css.expanded : css.collapsed,
				className,
			)}
			style={style}
			onBlur={onBlur}
			onKeyDown={onKeyDown}
		>
			<input
				type="hidden"
				name={name}
				value={values.map((x) =>
					["string", "number", "boolean"].includes(typeof x)
						? x
						: JSON.stringify(x)
				).join(",")}
			/>
			<button
				type="button"
				className={classNames(
					css.input,
					values.length > 0 && css.has_value,
					required && css.required,
					readonly && css.readonly,
					disabled && css.disabled,
					expanded && hasSearch && css.has_search,
				)}
				role="combobox"
				aria-labelledby={labelId}
				aria-controls={listboxId}
				aria-expanded={expanded}
				aria-activedescendant={expanded
					? (flatItems[activeIndex]?.id)
					: undefined}
				onClick={() => {
					if (expanded) {
						dispatch({ type: DROPDOWN_ACTION_TYPE_Close });
					} else {
						dispatch({
							type: DROPDOWN_ACTION_TYPE_Open,
							values,
						});
					}
				}}
				ref={setReference}
			>
				<span>{displayTpl(values)}</span>
			</button>
			<label id={labelId} className={css.label}>{label}</label>

			{icon}
			<Portal>
				<div
					className={classNames(
						css.picker,
						placement === "top" ? css.top : css.bottom,
					)}
					style={floatingStyle}
					ref={setFloating}
					onBlur={onBlur}
					hidden={!expanded}
				>
					<ConditionalRender when={expanded}>
						<ConditionalRender when={hasSearch}>
							<Search
								id={searchId}
								className={css.search}
								type="text"
								placeholder={searchPlaceholder}
								onChange={(event) =>
									dispatch({
										type: DROPDOWN_ACTION_TYPE_Search,
										search: event.target.value
											.trim(),
									})}
								ref={searchRef}
							/>
						</ConditionalRender>
						<ConditionalRender
							when={hasSearch && search !== "" &&
								items.length === 0}
						>
							{searchEmptyMessage}
						</ConditionalRender>
						<div className={css.scroller}>
							<Listbox
								items={items}
								id={listboxId}
								optionClassName={css.option}
								activeItemId={flatItems[activeIndex]?.id}
								multiple={multiple}
								value={value}
								onChange={(value) => {
									if (isFunction(onChange)) {
										dispatch({
											type: DROPDOWN_ACTION_TYPE_Close,
										});
										onChange(value);
									}
								}}
							/>
						</div>
					</ConditionalRender>
				</div>
			</Portal>
		</div>
	);
}

export { Dropdown };
