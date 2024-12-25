import { forwardRef } from "react";

import css from "./Input.module.css";
import { classNames } from "../utils/string";

interface InputProps extends
    React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    > {
    ref?: React.Ref<HTMLInputElement>;
}

const Input = forwardRef(function Input(
    props: InputProps,
    outerRef?: React.Ref<HTMLInputElement>,
) {
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
});

export { Input };
export type { InputProps };
