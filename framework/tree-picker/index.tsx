type TreeNode<T> = {
	display: string;
	value: T;
	children?: TreeNode<T>[];
};

type TreePickerProps<T> = {
	items: TreeNode<T>[];
	selected: T;
	onSelect: () => void;
};

function TreePicker<T>(props: TreePickerProps<T>) {}

export { TreePicker };
