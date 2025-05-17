import { Children, isValidElement } from "react";
import { Radio } from "../radio";
import { classNames } from "../utils/string";
import { RadioGroupItem, RadioGroupItemProps } from "./radio-group-item";

import css from "./radio-group.module.css";

type RadioGroupProps<T> = {
    id?: string;
    className?: string;
    style?: React.CSSProperties;
    legend: React.ReactNode;
    disabled?: boolean;
    name: string;
    value?: T;
    display?: "inline" | "block";
    small?: boolean;
    required?: boolean;
    children: React.ReactElement<RadioGroupItemProps> | React.ReactElement<
        RadioGroupItemProps
    >[];
    onChange?: (event: React.FormEvent<HTMLFieldSetElement>) => void;
};

function RadioGroup<T>(props: RadioGroupProps<T>) {
    const {
        legend,
        value: parentValue,
        disabled: parentDisabled,
        name,
        className,
        id,
        onChange,
        display,
        small,
        required,
        style,
    } = props;

    var children = Children.map(props.children, (child) => {
        if (isValidElement(child) && child.type === RadioGroupItem) {
            const { value, disabled, ...radioProps } = child.props;

            return (
                <Radio
                    key={String(value)}
                    name={name}
                    value={value}
                    defaultChecked={value === parentValue}
                    className={css.item}
                    small={small}
                    required={required}
                    disabled={parentDisabled || disabled}
                    {...radioProps}
                />
            );
        }

        return null;
    });

    return (
        <fieldset
            id={id}
            className={classNames(
                css.group,
                display === "inline" ? css.inline : css.block,
                className,
            )}
            style={style}
            disabled={parentDisabled}
            onChange={onChange}
        >
            {legend == null ? null : <legend>{legend}</legend>}
            {children}
        </fieldset>
    );
}

declare namespace RadioGroup {
    export function Item(props: RadioGroupItemProps): null;
}

RadioGroup.Item = RadioGroupItem;

export { RadioGroup };
