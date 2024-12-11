import { forwardRef } from "react";
import { classname } from "../utils/classname";
import css from "./Input.module.css";

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
            type={type}
            className={classname(css.input, className)}
            ref={ref}
            {...restInputProps}
        />
    );
});

export { Input };
export type { InputProps };
