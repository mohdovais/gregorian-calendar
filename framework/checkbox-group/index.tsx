import { Children, isValidElement, JSX } from "react";
import { Checkbox, CheckboxProps } from "../checkbox";
import { classNames } from "../utils/string";
import { isFunction } from "../utils/function";
import { ensureArray } from "../utils/array";
import {
    CheckboxGroupItem,
    CheckboxGroupItemProps,
} from "./checkbpx-group-item";
import css from "./checkbox-group.module.css";

type CheckboxGroupProps = {
    id?: string;
    className?: string;
    containerClassName?: string;
    style?: React.CSSProperties;
    legend: React.ReactNode;
    required?: boolean;
    disabled?: boolean;
    name: string;
    value?: string | string[];
    display?: "inline" | "block" | "grid";
    columns?: number;
    children: React.ReactElement<CheckboxGroupItemProps> | React.ReactElement<
        CheckboxGroupItemProps
    >[];
    onChange?: (value: string[]) => void;
    small?: boolean;
};

function CheckboxGroup(props: CheckboxGroupProps): JSX.Element {
    const {
        legend,
        value,
        disabled: parentDisabled,
        name,
        id,
        className,
        style,
        display,
        columns = 3,
        containerClassName,
        small,
        onChange,
    } = props;

    const parentValue = ensureArray(value);
    const parentRequired = props.required && parentValue.length === 0;

    var children = Children.map(props.children, (child) => {
        if (isValidElement(child) && child.type === CheckboxGroupItem) {
            const {
                value,
                disabled,
                required,
                ...checkboxProps
            } = child.props;

            return (
                <Checkbox
                    key={value}
                    className={css.label}
                    name={name}
                    value={value}
                    defaultChecked={value != null &&
                        parentValue.includes(value)}
                    small={small}
                    disabled={parentDisabled || disabled}
                    required={parentRequired || required}
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
            className={classNames(css.group, className)}
            style={style}
            disabled={parentDisabled}
            onChange={changeHandler}
        >
            <legend>{legend}</legend>
            <div
                className={classNames(
                    display === "inline"
                        ? css.inline
                        : display === "grid"
                        ? css.grid
                        : css.block,
                    containerClassName,
                )}
                // @ts-expect-error
                style={{ "--columns": columns }}
            >
                {children}
            </div>
        </fieldset>
    );
}

declare namespace CheckboxGroup {
    export function Item(props: CheckboxGroupItemProps): null;
}

CheckboxGroup.Item = CheckboxGroupItem;

export { CheckboxGroup };
