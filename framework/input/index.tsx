import { forwardRef, JSX } from "react";

import css from "./Input.module.css";
import { classNames } from "../utils/string";

interface InputProps extends
    React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    > {
    ref?: React.Ref<HTMLInputElement>;
}

function Input(
    props: InputProps,
    outerRef?: React.Ref<HTMLInputElement>,
): JSX.Element {
    const {
        type = "text",
        className,
        ...restInputProps
    } = props;

    return (
        <input
            {...restInputProps}
            type={type}
            ref={outerRef}
            className={classNames(css.input, className)}
        />
    );
}

const ForwardRef: React.ForwardRefExoticComponent<
    Omit<InputProps, "ref"> & React.RefAttributes<HTMLInputElement>
> = forwardRef(Input);

export { ForwardRef as Input };
export type { InputProps };
