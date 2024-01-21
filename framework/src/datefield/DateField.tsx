import { memo, useCallback, useEffect, useRef, useState } from "react";
import { StockButton } from "../button";
import { Calendar, CalendarProps } from "../calendar";
import commonStyle from "../css/common.module.css";
import { Floating } from "../floating/Floating";
import { ClarityCalendarLine } from "../icons/ClarityCalendarLine";
import { Input, InputProps } from "../input";
import { ensureArray } from "../utils/array";
import { classname } from "../utils/classname";
import {
	DateString,
	MAX_DATE_STRING,
	MIN_DATE_STRING,
	ensureDateString,
	ensureDateStringOrUndefined,
	parseDate,
} from "../utils/date";
import { format } from "../utils/date";
import { noop } from "../utils/function";
import { ensureNotNullOrUndefined } from "../utils/object";
import style from "./DateField.module.css";

interface DateFieldProps extends Omit<InputProps, "onChange"> {
	value?: string;
	min?: string;
	max?: string;
	locale?: string;
	weekStartDay?: CalendarProps["weekStartDay"];
	disabledDates?: CalendarProps["disabledDates"];
	disabledDays?: CalendarProps["disabledDays"];
	dayNameFormat?: CalendarProps["dayNameFormat"];
	onChange?: (date: DateString | undefined) => void;
}

function DateField(props: DateFieldProps) {
	const {
		className,
		dayNameFormat,
		name,
		locale,
		weekStartDay,
		disabledDates: _disabledDates,
		disabledDays: _disabledDays,
		min: _min,
		max: _max,
		value: _value,
		onChange = noop as Required<DateFieldProps>["onChange"],
		...inputProps
	} = props;

	const disabledDates = ensureArray(_disabledDates);
	const disabledDays = ensureArray(_disabledDays);
	const min = ensureDateString(_min, MIN_DATE_STRING);
	const max = ensureDateString(_max, MAX_DATE_STRING);
	const value = ensureDateStringOrUndefined(_value);
	const inputRef = useRef<HTMLInputElement>(null);

	const self = useRef({ value: value });
	const hiddenInputRef = useRef<HTMLInputElement | null>(null);
	const [isOpen, setIsOpen] = useState(false);

	const triggerChange = useCallback(
		(value: DateString | undefined) => {
			const input = inputRef.current;
			const hiddenInput = hiddenInputRef.current;
			if (
				input != null &&
				hiddenInput != null &&
				value !== self.current.value
			) {
				self.current.value = value;
				hiddenInput.value = ensureNotNullOrUndefined(
					value as string | undefined,
					"",
				);
				input.value = format(value, locale);
				onChange(value);
			}

			setIsOpen(false);
		},
		[onChange, locale],
	);

	const onBlur = useCallback(
		(event: React.FocusEvent<HTMLInputElement>) => {
			triggerChange(parseDate(event.target.value.trim()));
		},
		[triggerChange],
	);

	useEffect(() => {
		const input = inputRef.current;
		if (input == null) {
			return;
		}
		input.value = format(value, locale);
		self.current = { value: value };
		if (value != null) {
			let validity = "";
			if (value < min) {
				validity = `Minimum date allowed is ${format(min, locale)}`;
			} else if (value > max) {
				validity = `Maximun date allowed is ${format(max, locale)}`;
			} else if (disabledDates.includes(value)) {
				validity = `Date ${format(max, locale)} is not allowed`;
			}
			input.setCustomValidity(validity);
		}
	}, [locale, min, max, disabledDates, value]);

	return (
		<span className={style.wrapper}>
			<input
				type="hidden"
				name={name}
				value={value == null ? "" : value}
				ref={hiddenInputRef}
				readOnly
			/>
			<Input
				{...inputProps}
				className={classname(style.field, className)}
				defaultValue={format(value, locale)}
				autoCapitalize="off"
				autoCorrect="off"
				autoComplete="off"
				ref={inputRef}
				onBlur={onBlur}
				min={min}
				max={max}
			/>
			<StockButton
				className={style.trigger}
				active={isOpen}
				onClick={() => setIsOpen((x) => !x)}
			>
				<ClarityCalendarLine width={16} height={16} />
			</StockButton>
			<Floating show={isOpen} refElement={inputRef.current} focusable={false}>
				<Calendar
					className={commonStyle.window}
					dayNameFormat={dayNameFormat}
					disabledDates={disabledDates}
					disabledDays={disabledDays}
					locale={locale}
					max={max}
					min={min}
					value={value}
					weekStartDay={weekStartDay}
					onChange={triggerChange}
				/>
			</Floating>
		</span>
	);
}

const DateFieldMemo = memo(DateField);
export { DateFieldMemo as DateField };
