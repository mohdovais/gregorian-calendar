import { forwardRef } from "react";
import { classname } from "../utils/classname";

import style from "./base-button.module.css";

interface BaseButtonProps extends
	React.DetailedHTMLProps<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> {
	active?: boolean;
}

function BaseButton(
	props: BaseButtonProps,
	ref?: React.Ref<HTMLButtonElement>,
) {
	const { active, children, className, type = "button", ...restProps } =
		props;
	return (
		<button
			{...restProps}
			className={classname(style.btn, active && style.active, className)}
			type={type}
			ref={ref}
		>
			{children}
		</button>
	);
}

const StockButtonWithRef = forwardRef(BaseButton) as typeof BaseButton;

export { StockButtonWithRef as BaseButton };
export type { BaseButtonProps };
