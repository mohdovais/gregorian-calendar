import { forwardRef, useCallback, useMemo, useRef, useState } from "react";
import { ensureArray } from "../utils/array";
import { classname } from "../utils/classname";
import { noop } from "../utils/function";
import css from "./Listbox.module.css";
import {
	GroupOrOption,
	Option,
	OptGroup,
	updateMultipleSelection,
	createItems,
	PrivateGroupOrOption,
	findNextFocusableOption,
	PrivateOption,
	findPrevFocusableOption,
	selectAll,
	NODE_TYPE_OPTION,
	findFirstFoucsableOption,
	findOptionByValue,
	useStateRef,
} from "./utils";

const TRUE = true;

type OptionTplProps<T> = {
	item: Option<T>;
};

interface OptionListCommonProps<T> {
	id?: string;
	className?: string;
	style?: React.CSSProperties;

	items: GroupOrOption<T>[];
	ItemTpl?: (props: OptionTplProps<T>) => JSX.Element;
	role?: React.AriaRole;
	itemRole?: React.AriaRole;

	groupClassName?: string;
	optionClassName?: string;
	disabled?: boolean;

	onActiveDescendantChange?: (activeDescendant: string) => void;
}

interface OptionListSingleProps<T> extends OptionListCommonProps<T> {
	selection?: T;
	onSelect?: (newSelection: T) => void;
}

interface OptionListMultipleProps<T> extends OptionListCommonProps<T> {
	selection?: T[];
	onSelect?: (newSelection: T[]) => void;
}

type OptionListProps<T, U> = U extends typeof TRUE
	? OptionListMultipleProps<T>
	: OptionListSingleProps<T>;

type ListboxProps<ValueType, IsMultiple> = {
	multiple?: IsMultiple;
} & OptionListProps<ValueType, IsMultiple>;

function renderTree<T, U>(
	options: PrivateGroupOrOption<T>[],
	props: ListboxProps<T, U>,
	activeNode?: PrivateOption<T>,
) {
	const nodes: React.ReactNode[] = [];
	const {
		itemRole = "option",
		multiple = false,
		onSelect = noop,
		ItemTpl,
	} = props;
	const selection = ensureArray(props.selection);
	const singleValue = selection[0];

	ensureArray(options).forEach((node) => {
		const isDisabled = node.disabled;

		if (node.type === NODE_TYPE_OPTION) {
			const isSelected = multiple
				? selection.includes(node.value)
				: node.value === singleValue;

			const isActive = !isDisabled && activeNode === node;

			nodes.push(
				<li
					key={node.id}
					id={node.id}
					className={classname(
						css.listitem,
						isDisabled && css.disabled,
						isSelected && css.selected,
						isActive && css.active,
						props.optionClassName,
					)}
					role={itemRole}
					aria-disabled={isDisabled || undefined}
					aria-selected={isDisabled ? undefined : isSelected}
					onClick={
						isDisabled
							? undefined
							: () =>
									onSelect(
										multiple
											? updateMultipleSelection(selection, node.value)
											: node.value,
									)
					}
					onKeyDown={undefined}
				>
					{typeof ItemTpl === "function" ? <ItemTpl item={node} /> : node.label}
				</li>,
			);
		} else {
			const key = node.id;
			nodes.push(
				<li key={key}>
					{node.label === "" ? null : (
						<div
							className={css.groupTitle}
							role="presentation"
							aria-owns={key}
							aria-expanded="true"
						>
							{node.label}
						</div>
					)}
					<ul
						id={key}
						role="group"
						className={classname(css.group, props.groupClassName)}
					>
						{renderTree<T, U>(node.items, props, activeNode)}
					</ul>
				</li>,
			);
		}
	});

	return nodes;
}

type LocalState<ValueType> = {
	items: PrivateGroupOrOption<ValueType>[];
	activeNode?: PrivateOption<ValueType>;
	selection: ValueType[];
	multiple: boolean;
	onSelect: CallableFunction;
	onActiveDescendantChange: CallableFunction;
};

const preventEvent = (event: React.KeyboardEvent<Element>) => {
	event.preventDefault();
	event.stopPropagation();
};

function Listbox<ValueType, IsMultiple extends boolean>(
	props: ListboxProps<ValueType, IsMultiple>,
	ref?: React.Ref<HTMLUListElement>,
) {
	const {
		role = "listbox",
		id,
		className,
		style,
		multiple,
		disabled,
		onSelect = noop,
		onActiveDescendantChange = noop,
	} = props;

	const selection = ensureArray(props.selection);
	const [activeNode, setActiveNode] = useState<
		PrivateOption<ValueType> | undefined
	>();

	const items = useMemo(
		() => createItems(props.items, disabled === true),
		[props.items, disabled],
	);

	const stateRef = useStateRef<LocalState<ValueType>>({
		activeNode,
		selection,
		items,
		multiple: multiple === true,
		onSelect,
		onActiveDescendantChange,
	});

	const onKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLUListElement>) => {
			const {
				activeNode,
				selection,
				items,
				multiple,
				onActiveDescendantChange,
				onSelect,
			} = stateRef.current;

			switch (event.key) {
				case "ArrowDown": {
					preventEvent(event);
					const nextNode = findNextFocusableOption(items, activeNode);
					setActiveNode((state) => (nextNode == null ? state : nextNode));

					if (nextNode != null) {
						onActiveDescendantChange(nextNode.id);
					}

					break;
				}
				case "ArrowUp": {
					preventEvent(event);
					const nextNode = findPrevFocusableOption(items, activeNode);
					setActiveNode((state) => (nextNode == null ? state : nextNode));

					if (nextNode != null) {
						onActiveDescendantChange(nextNode.id);
					}

					break;
				}
				case "a":
				case "A": {
					if (multiple && event.ctrlKey) {
						preventEvent(event);
						onSelect(selectAll(items));
					}
				}
				case "Enter": {
					if (activeNode != null) {
						preventEvent(event);
						onSelect(
							multiple
								? updateMultipleSelection(selection, activeNode.value)
								: activeNode.value,
						);
					}
				}
			}
		},
		[],
	);

	const onFocus = useCallback(() => {
		const { activeNode, selection, items } = stateRef.current;
		let toBeFocused = activeNode;
		if (activeNode == null && selection[0] != null) {
			toBeFocused = findOptionByValue(items, selection[0]);
		}

		setActiveNode(
			toBeFocused == null ? findFirstFoucsableOption(items) : toBeFocused,
		);
	}, []);

	const onBlur = useCallback(() => {
		setActiveNode(undefined);
	}, []);

	return (
		<ul
			id={id}
			className={classname(css.list, className)}
			style={style}
			role={role}
			aria-activedescendant={activeNode == null ? "" : activeNode.id}
			aria-multiselectable={multiple || undefined}
			tabIndex={0}
			onKeyDown={onKeyDown}
			onFocus={onFocus}
			onBlur={onBlur}
			ref={ref}
		>
			{renderTree<ValueType, IsMultiple>(items, props, activeNode)}
		</ul>
	);
}

const ListboxWithRef = forwardRef(Listbox) as typeof Listbox;

export { ListboxWithRef as Listbox };

export type { Option, OptGroup, GroupOrOption, ListboxProps };
