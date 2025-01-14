import { JSX } from "react";
import { classNames } from "../utils/string";

import css from "./radio.module.css";

interface RadioProps extends
    React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    > {
    label?: string;
    small?: boolean;
}

function Radio(props: RadioProps): JSX.Element {
    const {
        type,
        id,
        className,
        label,
        small = false,
        disabled = false,
        ...radioProps
    } = props;

    const radio = (
        <input
            type="radio"
            className={classNames(css.radio, small && css.small)}
            id={id}
            disabled={disabled}
            {...radioProps}
        />
    );

    return label == null ? radio : (
        <label
            htmlFor={id}
            className={classNames(
                css.label,
                disabled && css.disabled,
                className,
            )}
        >
            {radio}
            <span>{label}</span>
        </label>
    );
}

export { Radio };
export type { RadioProps };
