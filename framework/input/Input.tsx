interface InputProps
	extends React.DetailedHTMLProps<
		React.InputHTMLAttributes<HTMLInputElement>,
		HTMLInputElement
	> {
	ref?: React.Ref<HTMLInputElement>;
	customValidity?: (value: string) => string;
}

import { classname } from "../utils/classname";
import { noop } from "../utils/function";
import style from "./Input.module.css";
import { forwardRef, useCallback } from "react";

const Input = forwardRef(function Input(
	props: InputProps,
	ref?: React.Ref<HTMLInputElement>,
) {
	const {
		type = "text",
		className,
		customValidity,
		onChange = noop,
		...restInputProps
	} = props;

	const changeHandler = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const input = event.target;
			if (typeof customValidity === "function") {
				input.setCustomValidity(customValidity(input.value));
			}
			onChange(event);
		},
		[onChange],
	);

	return (
		<input
			type={type}
			className={classname(style.field, className)}
			{...restInputProps}
			onChange={changeHandler}
			ref={ref}
		/>
	);
});

export { Input };
export type { InputProps };
