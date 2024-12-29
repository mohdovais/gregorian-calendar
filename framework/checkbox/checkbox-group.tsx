import { Children, isValidElement } from "react";
import { Checkbox, CheckboxProps } from ".";
import { classNames } from "../utils/string";

import css from "./checkbox-group.module.css";
import { isFunction } from "../utils/function";
import { ensureArray } from "../utils/array";

type CheckboxGroupProps = {
    id?: string;
    className?: string;
    style?: React.CSSProperties;
    legend: React.ReactNode;
    disabled?: boolean;
    name: string;
    value?: string[];
    horizontal?: boolean;
    children: React.ReactElement<CheckboxGroupItemProps> | React.ReactElement<
        CheckboxGroupItemProps
    >[];
    onChange?: (value: string[]) => void;
};

function CheckboxGroup(props: CheckboxGroupProps) {
    const {
        legend,
        value,
        disabled,
        name,
        id,
        className,
        style,
        horizontal = false,

        onChange,
    } = props;

    const parentValue = ensureArray(value);

    var children = Children.map(props.children, (child) => {
        if (isValidElement(child) && child.type === CheckboxGroupItem) {
            const {
                value,
                ...checkboxProps
            } = child.props;

            return (
                <Checkbox
                    key={String(value)}
                    className={css.label}
                    name={name}
                    value={value}
                    defaultChecked={parentValue.includes(value)}
                    {...checkboxProps}
                />
            );
        }

        return null;
    });

    const changeHandler = (event: React.FormEvent<HTMLFieldSetElement>) => {
        if (!isFunction(onChange)) {
            return;
        }

        const elements = event.currentTarget.elements;
        const values: string[] = [];

        for (let i = 0, l = elements.length; i < l; i++) {
            const checkbox = elements[i] as HTMLInputElement;
            if (checkbox.checked) {
                values.push(checkbox.value);
            }
        }

        onChange(values);
    };

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
            onChange={changeHandler}
        >
            <legend>{legend}</legend>
            {children}
        </fieldset>
    );
}

interface CheckboxGroupItemProps
    extends Exclude<CheckboxProps, "name" | "checked" | "defaultChecked"> {
    label: React.ReactNode;
}

function CheckboxGroupItem(props: CheckboxGroupItemProps) {
    return null;
}

CheckboxGroup.Item = CheckboxGroupItem;

export { CheckboxGroup };
