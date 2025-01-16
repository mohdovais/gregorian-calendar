import { CheckboxProps } from "../checkbox";

interface CheckboxGroupItemProps extends
    Exclude<
        CheckboxProps,
        "name" | "checked" | "defaultChecked" | "required"
    > {
    label: React.ReactNode;
}

function CheckboxGroupItem(props: CheckboxGroupItemProps) {
    return null;
}

export { CheckboxGroupItem };
export type { CheckboxGroupItemProps };
