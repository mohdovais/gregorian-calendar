import { useId } from "react";
import css from "./textfield.module.css";
import { Input } from "../input";

interface TextFieldProps extends
	React.DetailedHTMLProps<
		React.InputHTMLAttributes<HTMLInputElement>,
		HTMLInputElement
	> {
	label: string;
	essential?: boolean;
	inputStyle?: React.CSSProperties;
}

function TextField(props: TextFieldProps) {
	const {
		id = useId(),
		className = "",
		label,
		style,
		inputStyle,
		type = "text",
		essential = false,
		...restProps
	} = props;
	const inputId = id + "-input";

	return (
		<div
			id={id}
			className={css.field + " " + className + " " +
				(essential ? css.required : "")}
			style={style}
		>
			<Input
				type={type}
				placeholder={label}
				id={inputId}
				className={css.input}
				style={inputStyle}
				{...restProps}
			/>
			<label htmlFor={inputId} className={css.label}>
				{label}
			</label>
		</div>
	);
}

export { TextField };
