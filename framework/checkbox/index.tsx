import { useEffect, useRef } from "react";
import { classNames } from "../utils/string";
import css from "./checkbox.module.css";

interface CheckboxProps extends
    React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    > {
    intermediate?: boolean;
}

function Checkbox(
    props: CheckboxProps,
) {
    const { type, intermediate = false, className, ...checkboxProps } = props;
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (ref.current != null) {
            ref.current.indeterminate = intermediate;
        }
    }, [intermediate]);

    return (
        <input
            type="checkbox"
            ref={ref}
            className={classNames(css.checkbox, className)}
            {...checkboxProps}
        />
    );
}

export { Checkbox };
