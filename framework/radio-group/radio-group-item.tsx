import { RadioProps } from "../radio";

interface RadioGroupItemProps extends
    Exclude<
        RadioProps,
        "name" | "checked" | "defaultChecked" | "required"
    > {
    label: string;
}

function RadioGroupItem(props: RadioGroupItemProps): null {
    return null;
}

export { RadioGroupItem };
export type { RadioGroupItemProps };
