import { ensureArray } from "../utils/array";
import { ListboxGroup } from "./ListboxGroup";
import { ListboxItem } from "./ListboxItem";
import { classNames } from "../utils/string";
import css from "./Listbox.module.css";
import { JSX } from "react";

type ListboxGroupType<T> = {
	id?: string;
	label?: string | React.ReactElement;
	disabled?: boolean;
	value?: never;
	children: ListboxOptionType<T>[];
};

type ListboxOptionType<T> = {
	id?: string;
	label: string | React.ReactElement;
	value: T;
	disabled?: boolean;
	children?: never;
};

type ListboxItemType<T> = ListboxGroupType<T> | ListboxOptionType<T>;

type ListboxProps<T> = {
	className?: string;
	id?: string;
	style?: React.CSSProperties;
	multiple?: boolean;
	items: ListboxItemType<T>[];
	itemTpl?: (value: T) => React.ReactElement | string;
	value?: T | T[];
	disabled?: boolean;
	activeItemId?: string;
	optionClassName?: string;
	groupClassName?: string;
	onChange?: (value: T) => void;
};

function Listbox<T>(props: ListboxProps<T>): JSX.Element {
	const {
		id,
		className,
		optionClassName,
		groupClassName,
		style,
		disabled = false,
		multiple = false,
		items,
		value,
		onChange,
		activeItemId,
	} = props;

	const ensuredValue = ensureArray(value);
	const effectiveValue = multiple ? ensuredValue : ensuredValue.slice(0, 1);

	return (
		<div
			id={id}
			className={classNames(css.listbox, className)}
			style={style}
			role="listbox"
			tabIndex={-1}
		>
			{renderItems(
				items,
				effectiveValue,
				disabled,
				activeItemId,
				optionClassName,
				groupClassName,
				onChange,
			)}
		</div>
	);
}

function isGroupType<T>(
	subject: ListboxItemType<T>,
): subject is ListboxGroupType<T> {
	return Object.hasOwn(subject, "children");
}

function renderItems<T>(
	items: ListboxProps<T>["items"],
	selected: T[],
	parentDisabled: boolean,
	activeItemId?: string,
	optionClassName?: string,
	groupClassName?: string,
	onClick?: ListboxProps<T>["onChange"],
) {
	return ensureArray(items).map((item) => {
		const { id, disabled = false, label, value } = item;
		const isDisabled = parentDisabled || disabled;
		return isGroupType(item)
			? (
				<ListboxGroup
					key={id}
					id={id}
					className={groupClassName}
					label={label}
				>
					{renderItems(
						item.children,
						selected,
						isDisabled,
						activeItemId,
						optionClassName,
						groupClassName,
						onClick,
					)}
				</ListboxGroup>
			)
			: (
				<ListboxItem
					key={id}
					id={id}
					className={optionClassName}
					value={item.value}
					disabled={isDisabled}
					active={activeItemId === id}
					selected={selected.includes(item.value)}
					onClick={onClick}
				>
					{label}
				</ListboxItem>
			);
	});
}

export { Listbox };
export type {
	ListboxGroupType,
	ListboxItemType,
	ListboxOptionType,
	ListboxProps,
};
