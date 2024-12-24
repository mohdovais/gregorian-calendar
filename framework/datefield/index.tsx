import { useEffect, useMemo, useState } from "react";
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
import { BaseButton } from "../button/base-button";

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
            __children={
                <>
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
                    >
                        📅
                    </BaseButton>
                    <Portal>
                        <ConditionalRender when={expanded}>
                            <div
                                className={css.floating}
                                ref={setFloating}
                                style={floatingStyle}
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
