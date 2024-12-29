import { classNames } from "../utils/string";
import css from "./radio.module.css";

interface RadioProps extends
    React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    > {
    label?: string;
}

function Radio(
    props: RadioProps,
) {
    const {
        type,
        id,
        className,
        label,
        ...radioProps
    } = props;

    const radio = (
        <input
            type="radio"
            className={css.radio}
            id={id}
            {...radioProps}
        />
    );

    return label == null
        ? radio
        : (
            <label htmlFor={id} className={classNames(css.label, className)}>
                {radio}
                <span>{label}</span>
            </label>
        );
}

export { Radio };
export type { RadioProps };
