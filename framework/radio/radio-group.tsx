import { Children, isValidElement } from "react";
import { Radio, RadioProps } from ".";
import { classNames } from "../utils/string";

import css from "./radio-group.module.css";

type RadioGroupProps<T> = {
    id?: string;
    className?: string;
    style?: React.CSSProperties;
    legend: React.ReactNode;
    disabled?: boolean;
    name: string;
    value?: T;
    horizontal?: boolean;
    children: React.ReactElement<RadioGroupItemProps> | React.ReactElement<
        RadioGroupItemProps
    >[];
    onChange?: (event: React.FormEvent<HTMLFieldSetElement>) => void;
};

function RadioGroup<T>(props: RadioGroupProps<T>) {
    const {
        legend,
        value: parentValue,
        disabled,
        name,
        className,
        id,
        onChange,
        horizontal = false,
        style,
    } = props;

    var children = Children.map(props.children, (child) => {
        if (isValidElement(child) && child.type === RadioGroupItem) {
            const { value, ...radioProps } = child.props;

            return (
                <Radio
                    key={String(value)}
                    name={name}
                    value={value}
                    defaultChecked={value === parentValue}
                    className={css.radio}
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
                horizontal ? css.horozontal : css.vertical,
                className,
            )}
            style={style}
            disabled={disabled}
            onChange={onChange}
        >
            <legend>{legend}</legend>
            {children}
        </fieldset>
    );
}

interface RadioGroupItemProps
    extends Exclude<RadioProps, "name" | "checked" | "defaultChecked"> {
    label: string;
}

function RadioGroupItem(props: RadioGroupItemProps) {
    return null;
}

RadioGroup.Item = RadioGroupItem;

export { RadioGroup };
