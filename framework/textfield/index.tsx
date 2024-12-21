import { useId } from "react";
import { Input } from "../input";

import css from "./textfield.module.css";
import { classNames } from "../utils/string";

interface TextFieldProps extends
	React.DetailedHTMLProps<
		React.InputHTMLAttributes<HTMLInputElement>,
		HTMLInputElement
	> {
	label: string;
	essential?: boolean;
	inputId?: string;
	inputClassName?: string;
	inputStyle?: React.CSSProperties;
	__children?: React.ReactNode;
}

function TextField(props: TextFieldProps) {
	const randomId = useId();

	const {
		id = randomId,
		className,
		style,
		label,
		placeholder = "ph",
		inputId = id + "-input",
		inputClassName,
		inputStyle,
		type = "text",
		essential = false,
		__children,
		...restProps
	} = props;

	return (
		<div
			id={id}
			className={classNames(
				css.field,
				props.placeholder != null && css.has_placeholder,
				essential ? css.required : "",
				className,
			)}
			style={style}
		>
			<Input
				{...restProps}
				type={type}
				id={inputId}
				className={classNames(css.input, inputClassName)}
				style={inputStyle}
				placeholder={placeholder}
			/>
			<label htmlFor={inputId} className={css.label}>
				{label}
			</label>
			{__children}
		</div>
	);
}

export { TextField };
export type { TextFieldProps };
