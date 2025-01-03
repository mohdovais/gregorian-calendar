import { Children, isValidElement } from "react";
import { Checkbox, CheckboxProps } from "../checkbox";
import { classNames } from "../utils/string";
import { isFunction } from "../utils/function";
import { ensureArray } from "../utils/array";

import css from "./checkbox-group.module.css";

type CheckboxGroupProps = {
    id?: string;
    className?: string;
    style?: React.CSSProperties;
    legend: React.ReactNode;
    disabled?: boolean;
    name: string;
    value?: string | string[];
    horizontal?: boolean;
    children: React.ReactElement<CheckboxGroupItemProps> | React.ReactElement<
        CheckboxGroupItemProps
    >[];
    onChange?: (value: string[]) => void;
    small?: boolean;
};

function CheckboxGroup(props: CheckboxGroupProps) {
    const {
        legend,
        value,
        disabled: parentDisabled,
        name,
        id,
        className,
        style,
        horizontal = false,
        small,
        onChange,
    } = props;

    const parentValue = ensureArray(value);

    var children = Children.map(props.children, (child) => {
        if (isValidElement(child) && child.type === CheckboxGroupItem) {
            const {
                value,
                disabled,
                ...checkboxProps
            } = child.props;

            return (
                <Checkbox
                    key={String(value)}
                    className={css.label}
                    name={name}
                    value={value}
                    defaultChecked={value != null &&
                        parentValue.includes(value)}
                    small={small}
                    disabled={parentDisabled || disabled}
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
            disabled={parentDisabled}
            onChange={changeHandler}
        >
            <legend>{legend}</legend>
            {children}
        </fieldset>
    );
}

interface CheckboxGroupItemProps extends
    Exclude<
        CheckboxProps,
        "name" | "checked" | "defaultChecked" | "required"
    > {
    label: React.ReactNode;
}

function CheckboxGroupItem(props: CheckboxGroupItemProps) {
    return null;
}

CheckboxGroup.Item = CheckboxGroupItem;

export { CheckboxGroup };
