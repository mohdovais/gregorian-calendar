interface InputProps
	extends React.DetailedHTMLProps<
		React.InputHTMLAttributes<HTMLInputElement>,
		HTMLInputElement
	> {
	ref?: React.Ref<HTMLInputElement>;
}

import { classname } from "../utils/classname";
import style from "./Input.module.css";
import { forwardRef } from "react";

const Input = forwardRef(function Input(
	props: InputProps,
	ref?: React.Ref<HTMLInputElement>,
) {
	const { type = "text", className, ...restInputProps } = props;
	return (
		<input
			type={type}
			className={classname(style.field, className)}
			{...restInputProps}
			ref={ref}
		/>
	);
});

export { Input };
