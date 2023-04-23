import { StockButton } from "../button";

interface ComboboxProps<T> {
	collapseOnSelect?: boolean;
	delimiter?: string;
	displayField?: keyof T;
	displayTpl?: null;
	editable?: boolean;
	name?: string;
	id?: string;
	itemTpl?: null;
	multiselect?: boolean;
	options: T[];
	selection?: T;
	valueField: keyof T;
}

function Combobox() {
	return (
		<div>
			<div
				role="combobox"
				aria-expanded={true}
				aria-haspopup="dialog"
				aria-autocomplete="none"
				aria-controls="1"
				aria-activedescendant=""
			/>
			<StockButton aria-hidden={true} tabIndex={-1} />
			<div />
		</div>
	);
}

export { Combobox };
