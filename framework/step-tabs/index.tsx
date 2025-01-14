import { JSX, useRef } from "react";
import { ensureArray } from "../utils/array";

import { isFunction } from "../utils/function";
import css from "./tabs.module.css";
import { classNames } from "../utils/string";

type TabItem<T> = {
    label: React.ReactElement | string;
    value: T;
};

type TabsProps<T> = {
    id?: string;
    className?: string;
    style?: React.CSSProperties;
    items: TabItem<T>[];
    active?: T;
    disabled?: boolean | T[];
    onChange?: (value: T) => void;
};

function Tabs<T extends string | number>(props: TabsProps<T>): JSX.Element {
    const { items, className, id, style, active, disabled, onChange } = props;
    const indices = useRef({
        curr: -1,
        prev: -1,
    });

    const disabledValues = Array.isArray(disabled) ? disabled : [];
    const hasOnChange = isFunction(onChange);

    const children = ensureArray(items).map((tab, i) => {
        const { label, value } = tab;
        const isDisabled = disabled === true ||
            disabledValues.includes(value);
        const isClickable = hasOnChange && !isDisabled;
        const isSelected = active === value;
        let steps = 0;

        const { curr, prev } = indices.current;

        if (isSelected) {
            if (prev !== -1) {
                steps = prev - i;
            }

            if (curr !== i) {
                indices.current.curr = i;
                indices.current.prev = curr;
            }
        }

        const cn = classNames(
            css.tab,
            isDisabled && css.disabled,
            isSelected && css.active,
            isClickable && css.clickable,
        );

        return (
            <li
                key={i}
                className={cn}
                // @ts-expect-error
                style={{ "--steps": steps }}
                role="tab"
                aria-selected={isSelected}
                tabIndex={isClickable ? 0 : -1}
                onClick={isClickable ? () => onChange(value) : undefined}
            >
                <div className={css.label}>{label}</div>
            </li>
        );
    });

    return (
        <ul
            id={id}
            className={classNames(
                css.tabs,
                className,
            )}
            style={style}
            role="tablist"
        >
            {children}
        </ul>
    );
}

export { Tabs };
