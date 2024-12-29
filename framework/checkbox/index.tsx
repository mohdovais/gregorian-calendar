import { useEffect, useRef } from "react";
import { classNames } from "../utils/string";
import css from "./checkbox.module.css";

interface CheckboxProps extends
    React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    > {
    intermediate?: boolean;
    label?: React.ReactNode;
    value: string;
}

function Checkbox(props: CheckboxProps) {
    const {
        type,
        intermediate = false,
        className,
        label,
        ...checkboxProps
    } = props;

    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (ref.current != null) {
            ref.current.indeterminate = intermediate;
        }
    }, [intermediate]);

    const input = (
        <input
            type="checkbox"
            ref={ref}
            className={css.checkbox}
            {...checkboxProps}
        />
    );

    return label == null
        ? input
        : (
            <label className={classNames(css.label, className)}>
                {input}
                <span>{label}</span>
            </label>
        );
}

export { Checkbox };
export type { CheckboxProps };
