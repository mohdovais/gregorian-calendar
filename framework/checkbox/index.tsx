import { JSX, useEffect, useRef } from "react";
import { classNames } from "../utils/string";
import css from "./checkbox.module.css";

interface CheckboxProps extends
    React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    > {
    intermediate?: boolean;
    label?: React.ReactNode;
    small?: boolean;
    value?: string;
}

function Checkbox(props: CheckboxProps): JSX.Element {
    const {
        type,
        intermediate = false,
        small = false,
        className,
        label,
        disabled,
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
            className={classNames(css.checkbox, small && css.small)}
            disabled={disabled}
            {...checkboxProps}
        />
    );

    return label == null ? input : (
        <label
            className={classNames(
                css.label,
                disabled && css.disabled,
                className,
            )}
        >
            {input}
            <span>{label}</span>
        </label>
    );
}

export { Checkbox };
export type { CheckboxProps };
