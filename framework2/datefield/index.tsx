import { useCallback, useMemo } from "react";
import { TextField, TextFieldProps } from "../textfield";
import { classname } from "../utils/classname";
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

import css from "./datefield.module.css";

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
    onChange?: (date: DateString | undefined) => void;
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
        onChange,
        ...restProps
    } = props;

    min = isDateString(min) ? min : MIN_DATE_STRING;
    max = isDateString(max) ? max : MAX_DATE_STRING;
    value = isDateString(value) ? value : "";

    const parser = useMemo(() => createDateParser(dateFormat), [dateFormat]);

    const inputChangeHandler = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            if (isFunction(onChange)) {
                const value = event.target.value;
                const result = parser(value);
                onChange(result);
            }
        },
        [onChange],
    );

    return (
        <div>
            <TextField
                {...restProps}
                type="text"
                autoCapitalize="off"
                autoCorrect="off"
                autoComplete="off"
                label={label}
                placeholder={dateFormat}
                defaultValue={formatDate(new Date(value), dateFormat)}
                onChange={inputChangeHandler}
                __children={
                    <>
                        <input
                            type="hidden"
                            form={form}
                            name={name}
                            value={value}
                        />
                        <button type="button" className={css.trigger}>
                            📅
                        </button>
                        <Portal>
                            <div>sss</div>
                        </Portal>
                    </>
                }
            />
        </div>
    );
}

export { DateField };
export type { DateFieldProps };
