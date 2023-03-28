import { createRandomId } from "../hooks/useId";
import { ensureArray } from "../utils/array";
import { classname } from "../utils/classname";
import { hasKey } from "../utils/object";
import css from "./OptionList.module.css";

type Option<T> = {
	label: string | React.ReactNode;
	value: T;
	disabled?: boolean;
	selected?: boolean;
} & Record<string, unknown>;

type OptGroup<T> = {
	disabled?: boolean;
	label?: string;
	options: Option<T>[];
} & Record<string, unknown>;

type GroupOrOption<T> = Option<T> | OptGroup<T>;

interface OptionListProps<T> {
	id?: string;
	className?: string;
	style?: React.CSSProperties;

	options: GroupOrOption<T>[];
	optionTpl?: (option: Option<T>) => string | React.ReactNode;
	role?: "tree" | "menu" | "list";

	groupClassName?: string;
	itemClassName?: string;
	titleClassName?: string;
	disabled?: boolean;

	value?: T | T[];
	onSelection?: (value: T) => void;
	onMouseOver?: (value: T) => void;
	multiple?: boolean;
}

function isOption<T>(option: GroupOrOption<T>): option is Option<T> {
	return hasKey(option, "value");
}

const keysCache = new WeakMap<object, string>();
function getKeyForObject(obj: object, prefix?: string) {
	if (keysCache.has(obj)) {
		return keysCache.get(obj);
	} else {
		var newKey = createRandomId(prefix);
		keysCache.set(obj, newKey);
		return newKey;
	}
}

function renderGroup<T>(
	group: OptGroup<T>,
	props: OptionListProps<T>,
	isParentDisabled: boolean,
) {
	const key = getKeyForObject(group, "group-");

	return (
		<li key={key}>
			{group.label ? (
				<div
					className={classname(css.groupTitle, props.titleClassName)}
					role="presentation"
					aria-owns={key}
					aria-expanded="true"
				>
					{group.label}
				</div>
			) : null}
			<ul
				id={key}
				role="group"
				className={classname(css.group, props.groupClassName)}
			>
				{renderOptions(
					group.options,
					props,
					isParentDisabled || group.disabled === true,
				)}
			</ul>
		</li>
	);
}

function renderOptions<T>(
	options: GroupOrOption<T>[],
	props: OptionListProps<T>,
	isParentDisabled: boolean,
) {
	const nodes: React.ReactNode[] = [];
	const { role = "tree", multiple = false, onSelection, optionTpl } = props;
	const value = ensureArray(props.value);
	const singleValue = value[0];
	const hasOptionTpl = typeof optionTpl === "function";

	ensureArray(options).forEach((node) => {
		const isDisabled = isParentDisabled || node.disabled === true;
		if (isOption(node)) {
			const key = getKeyForObject(node, "option-");
			const isSelected = multiple
				? value.includes(node.value)
				: node.value === singleValue;

			nodes.push(
				<li
					key={key}
					id={key}
					className={classname(
						css.listitem,
						isDisabled && css.disabled,
						isSelected && css.selected,
						props.itemClassName,
					)}
					role={role + "item"}
					aria-disabled={isDisabled || undefined}
					aria-selected={isSelected || undefined}
					onClick={
						!isDisabled && typeof onSelection === "function"
							? () => onSelection(node.value)
							: undefined
					}
					onKeyDown={undefined}
					tabIndex={-1}
				>
					{hasOptionTpl ? optionTpl(node) : node.label}
				</li>,
			);
		} else {
			nodes.push(renderGroup(node, props, isParentDisabled));
		}
	});

	return nodes;
}

function OptionList<T>(props: OptionListProps<T>) {
	const {
		options,
		role = "tree",
		id,
		className,
		style,
		multiple = false,
	} = props;

	return (
		<ul
			id={id}
			className={classname(css.list, className)}
			style={style}
			role={role}
			aria-activedescendant=""
			aria-multiselectable={multiple || undefined}
		>
			{renderOptions(options, props, props.disabled === true)}
		</ul>
	);
}

export { OptionList };

export type { Option, OptGroup, GroupOrOption };
