import { ensureArray } from "../utils/array";
import { classname } from "../utils/classname";
import { ListboxProps } from "./Listbox";
import { ListboxItem, ListboxItemProps } from "./ListboxItem";
import { ListGroupOrItemConfig, ListItemConfig, NODE_TYPE_ITEM } from "./utils";
import css from "./Listbox.module.css";

function renderTree<T, U>(
	options: ListGroupOrItemConfig<T>[],
	props: ListboxProps<T, U>,
	activeNode?: ListItemConfig<T>,
	onSelect?: ListboxItemProps<T>["onSelect"],
	onMouseOver?: ListboxItemProps<T>["onMouseOver"],
) {
	const treeNodes: React.ReactNode[] = [];
	const { itemRole = "option", multiple, itemTpl } = props;
	const selection = ensureArray(props.selection);
	const singleValue = selection[0];
	const isMultiple = multiple === true;

	ensureArray(options).forEach((item) => {
		const isDisabled = item.disabled;

		if (item.type === NODE_TYPE_ITEM) {
			const isSelected = isMultiple
				? selection.includes(item.value)
				: item.value === singleValue;

			const isActive = !isDisabled && activeNode === item;

			treeNodes.push(
				<ListboxItem
					key={item.id}
					id={item.id}
					className={props.itemClassName}
					item={item}
					itemTpl={itemTpl}
					role={itemRole}
					multiple={isMultiple}
					active={isActive}
					disabled={isDisabled}
					selected={isSelected}
					onSelect={onSelect}
					onMouseOver={onMouseOver}
				/>,
			);
		} else {
			const key = item.id;
			treeNodes.push(
				<li key={key}>
					{item.label === "" ? null : (
						<div
							className={css.groupTitle}
							role="presentation"
							aria-owns={key}
							aria-expanded="true"
						>
							{item.label}
						</div>
					)}
					<ul
						id={key}
						role="group"
						className={classname(css.group, props.groupClassName)}
					>
						{renderTree<T, U>(
							item.items,
							props,
							activeNode,
							onSelect,
							onMouseOver,
						)}
					</ul>
				</li>,
			);
		}
	});

	return treeNodes;
}

export { renderTree };
