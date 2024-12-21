import { forwardRef } from "react";

import css from "./Input.module.css";
import { classNames } from "../utils/string";

type InputProps = React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
>;

const Input = forwardRef(function Input(
    props: InputProps,
    ref?: React.Ref<HTMLInputElement>,
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
            className={classNames(css.input, className)}
            ref={ref}
        />
    );
});

export { Input };
export type { InputProps };
