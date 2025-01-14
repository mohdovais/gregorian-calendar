import { useEffect, useId, useMemo, useState } from "react";
import { TextField } from "../textfield";
import {
    DateString,
    formatDate,
    isDateString,
    MAX_DATE_STRING,
    MIN_DATE_STRING,
} from "../utils/date";
import { createDateParser } from "../utils/date.parser";
import { isFunction } from "../utils/function";
import { Portal } from "../portal";
import { Calendar } from "../calendar";
import { useFloating } from "./useFloating";

import css from "./datefield.module.css";
import { ConditionalRender } from "../conditional-render";
import { classNames } from "../utils/string";
import { BaseButton } from "../base-button";

const icon = (
    <svg
        enable-background="new 0 0 32 32"
        height="16"
        viewBox="0 0 32 32"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
    >
        <g>
            <path
                d="M29.334,3H25V1c0-0.553-0.447-1-1-1s-1,0.447-1,1v2h-6V1c0-0.553-0.448-1-1-1s-1,0.447-1,1v2H9V1 c0-0.553-0.448-1-1-1S7,0.447,7,1v2H2.667C1.194,3,0,4.193,0,5.666v23.667C0,30.806,1.194,32,2.667,32h26.667 C30.807,32,32,30.806,32,29.333V5.666C32,4.193,30.807,3,29.334,3z M30,29.333C30,29.701,29.701,30,29.334,30H2.667 C2.299,30,2,29.701,2,29.333V5.666C2,5.299,2.299,5,2.667,5H7v2c0,0.553,0.448,1,1,1s1-0.447,1-1V5h6v2c0,0.553,0.448,1,1,1 s1-0.447,1-1V5h6v2c0,0.553,0.447,1,1,1s1-0.447,1-1V5h4.334C29.701,5,30,5.299,30,5.666V29.333z"
                fill="currentcolor"
            />
            <rect fill="currentcolor" height="3" width="4" x="7" y="12" />
            <rect fill="currentcolor" height="3" width="4" x="7" y="17" />
            <rect fill="currentcolor" height="3" width="4" x="7" y="22" />
            <rect fill="currentcolor" height="3" width="4" x="14" y="22" />
            <rect fill="currentcolor" height="3" width="4" x="14" y="17" />
            <rect fill="currentcolor" height="3" width="4" x="14" y="12" />
            <rect fill="currentcolor" height="3" width="4" x="21" y="22" />
            <rect fill="currentcolor" height="3" width="4" x="21" y="17" />
            <rect fill="currentcolor" height="3" width="4" x="21" y="12" />
        </g>
    </svg>
);

type InputProps = React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
>;

interface DateFieldProps
    extends Omit<InputProps, "type" | "value" | "onChange"> {
    min?: string;
    max?: string;
    value?: string | null;
    label: string;
    locale?: string;
    dateFormat?: string;
    onChange?: (date: DateString | null) => void;
}

function DateField(props: DateFieldProps) {
    let {
        min,
        max,
        value,
        name,
        form,
        label,
        dateFormat = "d/m/Y",
        locale = "en-GB",
        placeholder = dateFormat,
        onChange,
        ...restProps
    } = props;

    min = isDateString(min) ? min : MIN_DATE_STRING;
    max = isDateString(max) ? max : MAX_DATE_STRING;
    value = isDateString(value) ? value : "";

    const describeById = useId();
    const [expanded, setExpanded] = useState(false);
    const { reference, floatingStyle, setFloating, setReference } = useFloating(
        expanded,
    );
    const parser = useMemo(() => createDateParser(dateFormat), [dateFormat]);

    const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (isFunction(onChange)) {
            const input = event.target.value.trim();
            if (input === "") {
                if (value !== "") {
                    onChange(null);
                }
                return;
            }
            const result = parser(input);
            if (result != null && result !== value) {
                onChange(result || null);
            }
        }
    };

    const inputBlurHandler = (event: React.FocusEvent<HTMLInputElement>) => {
        if (isFunction(onChange)) {
            const input = event.target.value.trim();
            const result = parser(input);
            if (value !== result) {
                onChange(result || null);
            }
        }
    };

    useEffect(() => {
        if (reference != null && value !== "") {
            const validity = value < min
                ? `Value must be ${min} or later`
                : value > max
                ? `Value must be ${max} or earlier`
                : "";
            (reference as HTMLInputElement).setCustomValidity(validity);
        }
    }, [reference, value, min, max]);

    return (
        <TextField
            {...restProps}
            key={value}
            type="text"
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            label={label}
            placeholder={placeholder}
            defaultValue={formatDate(new Date(value), dateFormat)}
            onChange={inputChangeHandler}
            onBlur={inputBlurHandler}
            ref={setReference}
            aria-describedby={describeById}
            __children={
                <>
                    <div id={describeById} className={css.sr_only}>
                        Date format: {dateFormat}
                    </div>
                    <input
                        type="hidden"
                        form={form}
                        name={name}
                        value={value}
                    />
                    <BaseButton
                        className={classNames(
                            css.trigger,
                            expanded && css.active,
                        )}
                        onClick={() => setExpanded((x) => !x)}
                        aria-label="Choose Date"
                    >
                        {icon}
                    </BaseButton>
                    <Portal>
                        <ConditionalRender when={expanded}>
                            <div
                                className={css.floating}
                                ref={setFloating}
                                style={floatingStyle}
                                role="dialog"
                                aria-modal="true"
                                aria-label="Choose Date"
                            >
                                <Calendar
                                    key={value}
                                    weekStartDay={0}
                                    value={value}
                                    locale={locale}
                                    onChange={(date) => {
                                        setExpanded(false);
                                        if (isFunction(onChange)) {
                                            onChange(date);
                                        }
                                    }}
                                />
                            </div>
                        </ConditionalRender>
                    </Portal>
                </>
            }
        />
    );
}

export { DateField };
export type { DateFieldProps };
