import React, { useId, useState } from "react";
import { ensureArray, getNextItem, getPreviousItem } from "../utils/array";
import { ListboxGroup, ListboxGroupProps } from "./ListboxGroup";
import { ListboxItem, ListboxItemProps } from "./ListboxItem";

function isListboxItemNode<T>(
	node: React.ReactNode,
): node is React.ReactElement<ListboxItemProps<T>, typeof ListboxItem> {
	return React.isValidElement(node) && node.type === ListboxItem;
}

function isListboxGroupNode(
	node: React.ReactNode,
): node is React.ReactElement<ListboxGroupProps, typeof ListboxGroup> {
	return React.isValidElement(node) && node.type === ListboxGroup;
}

function headlessListbox<T>(
	children: React.ReactElement | React.ReactElement[] | null | undefined,
	value: null | undefined | T | T[],
	onSelect?: (value: T) => void,
) {
	const listboxId = useId();
	const [activeId, setActiveId] = useState<string>();

	const selection = ensureArray(value);
	const itemIds: string[] = [];
	const values: T[] = [];
	const items: React.ReactElement[] = [];

	function iii(
		child: React.ReactElement<
			ListboxItemProps<T>,
			<T>(props: ListboxItemProps<T>) => JSX.Element
		>,
		index: number,
	) {
		const { value, id, selected } = child.props;
		const itemId = id == null ? `${listboxId}-${index}` : id;

		values.push(value);
		itemIds.push(itemId);

		if (selected && value != null && selection.indexOf(value) === -1) {
			selection.push(value);
		}

		return React.cloneElement(child, {
			id: itemId,
			active: itemId === activeId,
			selected: selection.includes(value),
			onClick: onSelect,
		});
	}
	// biome-ignore lint/complexity/noForEach: need index
	React.Children.toArray(children).forEach((child, index) => {
		if (isListboxItemNode<T>(child)) {
			items.push(iii(child, index));
		} else if (isListboxGroupNode(child)) {
			const xxx: React.ReactElement[] = [];
			// biome-ignore lint/complexity/noForEach: <explanation>
			React.Children.toArray(child.props.children).forEach((child2, index2) => {
				if (isListboxItemNode<T>(child2)) {
					xxx.push(iii(child2, index2));
				}
			});

			items.push(React.cloneElement(child, {}, xxx));
		}
	});

	const onKeyDown = (event: React.KeyboardEvent<Element>) => {
		if (itemIds.length === 0) {
			return;
		}
		switch (event.key) {
			case "ArrowDown":
				{
					if (activeId == null) {
						setActiveId(itemIds[0]);
					} else {
						setActiveId(getNextItem(itemIds, activeId, true));
					}

					event.preventDefault();
				}
				break;
			case "ArrowUp":
				{
					if (activeId == null) {
						setActiveId(itemIds[0]);
					} else {
						setActiveId(getPreviousItem(itemIds, activeId, true));
					}

					event.preventDefault();
				}
				break;
			case " ":
			case "Enter":
				{
					if (activeId != null) {
						const index = itemIds.indexOf(activeId);
						if (index !== -1 && typeof onSelect === "function") {
							onSelect(values[index]);
						}
					}
				}
				break;
			default:
				console.log(event.key);
		}
	};

	let focusTimeout: NodeJS.Timeout;

	const onFocus = (event: React.FocusEvent<HTMLDivElement>) => {
		focusTimeout = setTimeout(() => {
			const index = value == null ? 0 : values.indexOf(value);
			setActiveId(itemIds[index === -1 ? 0 : index]);
		}, 10);
	};

	const onBlur = () => {
		setActiveId(undefined);
	};

	const onClick = () => {
		clearTimeout(focusTimeout);
	};

	return {
		activeId,
		items,
		eventListeners: {
			onKeyDown,
			onClick,
			onFocus,
			onBlur,
		},
	};
}

export { headlessListbox };
