import { Input } from "../input";
import {
	ListGroupOrItem,
	Listbox,
	ListboxConditionalProps,
	ListboxProps,
} from "../listbox";
import { ListboxItemProps } from "../listbox/ListboxItem";

type PickerProps<T, IsMultiple extends boolean> = ListboxConditionalProps<
	T,
	IsMultiple
> & {
	multiple?: IsMultiple;
	placeholder?: string;
	message?: string;
	items: ListGroupOrItem<T>[];
	itemTpl?: ListboxItemProps<T>["itemTpl"];
	onSearch?: (serachText: string) => void;
};

function Picker<T, U extends boolean>(props: PickerProps<T, U>) {
	const { message, placeholder, items } = props;
	return (
		<div>
			<div>{message}</div>
			<Input
				role="combobox"
				placeholder={placeholder}
				spellCheck="false"
				autoComplete="off"
				autoCapitalize="off"
				aria-autocomplete="list"
				aria-haspopup="listbox"
				aria-expanded="true"
				aria-controls=""
				aria-activedescendant=""
			/>
			{items.length === 0 ? "No data found" : <Listbox items={items} />}
		</div>
	);
}

export { Picker };
