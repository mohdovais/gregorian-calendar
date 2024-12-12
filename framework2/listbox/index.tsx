import { ensureArray } from "../utils/array";
import { classname } from "../utils/classname";
import { ListboxGroup } from "./ListboxGroup";
import { ListboxItem } from "./ListboxItem";
import css from "./Listbox.module.css";

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
	itemTpl?: (value: unknown) => React.ReactElement | string;
	value?: T | T[];
	disabled?: boolean;
	activeItemId?: string;
	optionClassName?: string;
	groupClassName?: string;
	onChange?: (value: T) => void;
};

const defaultItemTpl = (value: unknown) => String(value);

function Listbox<T>(props: ListboxProps<T>) {
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
		itemTpl = defaultItemTpl,
		activeItemId,
	} = props;

	const ensuredValue = ensureArray(value);
	const effectiveValue = multiple ? ensuredValue : ensuredValue.slice(0, 1);

	return (
		<div
			id={id}
			className={classname(css.listbox, className)}
			style={style}
			role="listbox"
			tabIndex={-1}
		>
			{renderItems(
				items,
				itemTpl,
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
	itemTpl: Exclude<ListboxProps<T>["itemTpl"], undefined>,
	selected: T[],
	parentDisabled: boolean,
	activeItemId?: string,
	optionClassName?: string,
	groupClassName?: string,
	onClick?: ListboxProps<T>["onChange"],
) {
	return ensureArray(items).map((item) => {
		const { id, disabled = false, label } = item;
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
						itemTpl,
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
					{itemTpl(label)}
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
