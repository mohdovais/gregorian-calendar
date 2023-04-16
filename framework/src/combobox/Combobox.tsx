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
			<div />
			<div />
		</div>
	);
}

export { Combobox };
