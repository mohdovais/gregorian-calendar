import { Calendar, CalendarProps } from "../calendar";
import commonStyle from "../css/common.module.css";
import { ensureArray } from "../util/array";
import {
	DateString,
	MAX_DATE_STRING,
	MIN_DATE_STRING,
	ensureDateString,
	ensureDateStringOrUndefined,
	parseDate,
} from "../util/date";
import { format } from "../util/date/format";
import { noop } from "../util/function";
import { ensureNotNullOrUndefined } from "../util/object";
import style from "./Datefield.module.css";
import { autoPlacement, useFloating } from "@floating-ui/react-dom";
import { useCallback, useEffect, useRef, useState } from "react";

interface DateFieldProps {
	id?: string;
	name?: string;
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
		dayNameFormat,
		name,
		id,
		locale,
		weekStartDay,
		onChange = (noop as DateFieldProps["onChange"])!,
	} = props;

	const disabledDates = ensureArray(props.disabledDates);
	const disabledDays = ensureArray(props.disabledDays);
	const min = ensureDateString(props.min, MIN_DATE_STRING);
	const max = ensureDateString(props.max, MAX_DATE_STRING);
	const value = ensureDateStringOrUndefined(props.value);

	const self = useRef({ value });
	const hiddenInputRef = useRef<HTMLInputElement | null>(null);
	const [isOpen, setIsOpen] = useState(false);
	const { x, y, strategy, refs } = useFloating({
		open: isOpen,
		middleware: [
			autoPlacement({
				crossAxis: true,
				allowedPlacements: [
					"bottom-end",
					"bottom-start",
					"top-end",
					"top-start",
				],
			}),
		],
	});

	const onBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
		triggerChange(parseDate(event.target.value.trim()));
	}, []);

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
				hiddenInput.value = ensureNotNullOrUndefined(value as string, "");
				input.value = format(value, locale);
				onChange(value);
			}
		},
		[refs, onChange],
	);

	return (
		<>
			<input type="hidden" name={name} value={value} ref={hiddenInputRef} />
			<input
				id={id}
				defaultValue={format(value, locale)}
				autoCapitalize="off"
				autoCorrect="off"
				autoComplete="off"
				ref={refs.setReference}
				onBlur={onBlur}
			/>
			{isOpen ? (
				<Calendar
					ref={refs.setFloating}
					className={commonStyle.window}
					style={{
						position: strategy,
						top: y ?? 0,
						left: x ?? 0,
						width: "max-content",
						display: "inline-block",
						padding: 20,
					}}
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
		</>
	);
}

export { DateField };
