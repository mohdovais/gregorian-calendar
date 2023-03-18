import { classname } from "../utils/classname";
import style from "./Button.module.css";
import { memo } from "react";

interface ButtonProps
	extends React.DetailedHTMLProps<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> {}

function Button(props: ButtonProps) {
	const { children, className, type = "button", ...restProps } = props;
	return (
		<button
			{...restProps}
			className={classname(style.btn, className)}
			type={type}
		>
			{children}
		</button>
	);
}

const ButtonMemo = memo(Button);

export { ButtonMemo as Button };
