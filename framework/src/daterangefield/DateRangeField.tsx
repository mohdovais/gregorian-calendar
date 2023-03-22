import { Calendar, CalendarProps } from "../calendar";
import commonStyle from "../css/common.module.css";
import { usePickerPosition } from "../hooks/usePickerPosition";
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
import style from "./DateRangeField.module.css";
import { memo, useCallback, useEffect, useRef, useState } from "react";

type DateRange = {
	start: string; //DateString;
	end: string; //DateString;
};

type DateStringRange = {
	start: DateString;
	end: DateString;
};

interface DateRangeFieldProps extends Omit<InputProps, "onChange" | "value"> {
	value?: DateRange;
	min?: string;
	max?: string;
	locale?: string;
	weekStartDay?: CalendarProps["weekStartDay"];
	disabledDates?: CalendarProps["disabledDates"];
	disabledDays?: CalendarProps["disabledDays"];
	dayNameFormat?: CalendarProps["dayNameFormat"];
	onChange?: (date: DateStringRange | undefined) => void;
}

function DateRanngeField(props: DateRangeFieldProps) {
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
		onChange = (noop as DateRangeFieldProps["onChange"])!,
		...inputProps
	} = props;

	const disabledDates = ensureArray(_disabledDates);
	const disabledDays = ensureArray(_disabledDays);
	const min = ensureDateString(_min, MIN_DATE_STRING);
	const max = ensureDateString(_max, MAX_DATE_STRING);
	const value = ensureDateStringOrUndefined(_value);

	const self = useRef({ value: value });
	const hiddenInputRef = useRef<HTMLInputElement | null>(null);
	const [isOpen, setIsOpen] = useState(false);
	const { floatStyle, refs } = usePickerPosition(isOpen);

	const triggerChange = useCallback(
		(value: DateString | undefined) => {
			const input = refs.reference.current as HTMLInputElement;
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
		[refs.reference, onChange, locale],
	);

	const onBlur = useCallback(
		(event: React.FocusEvent<HTMLInputElement>) => {
			triggerChange(parseDate(event.target.value.trim()));
		},
		[triggerChange],
	);

	useEffect(() => {
		var input = refs.reference.current as HTMLInputElement;
		if (input != null) {
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
		}
	}, [value, locale, min, max, disabledDates]);

	return (
		<span className={style.wrapper}>
			<input
				type="hidden"
				name={name}
				value={value}
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
				ref={refs.setReference}
				onBlur={onBlur}
			/>
			<button
				type="button"
				className={classname(style.trigger, isOpen && style.active)}
				onClick={() => setIsOpen((isOpen) => !isOpen)}
			>
				<ClarityCalendarLine width={16} height={16} />
			</button>
			{isOpen ? (
				<Calendar
					ref={refs.setFloating}
					className={commonStyle.window}
					style={floatStyle}
					dayNameFormat={dayNameFormat}
					disabledDates={disabledDates}
					disabledDays={disabledDays}
					locale={locale}
					max={max}
					min={min}
					onChange={triggerChange}
					value={value}
					weekStartDay={weekStartDay}
				/>
			) : null}
		</span>
	);
}

const DateRangeFieldMemo = memo(DateRanngeField);
export { DateRangeFieldMemo as DateRangeField };
