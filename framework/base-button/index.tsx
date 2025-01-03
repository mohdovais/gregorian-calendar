import { forwardRef, JSX } from "react";
import { classNames } from "../utils/string";

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
): JSX.Element {
	const {
		active,
		children,
		className,
		type = "button",
		tabIndex = 0,
		...restProps
	} = props;

	return (
		<button
			{...restProps}
			className={classNames(style.btn, active && style.active, className)}
			type={type}
			tabIndex={tabIndex}
			ref={ref}
		>
			{children}
		</button>
	);
}

const StockButtonWithRef = forwardRef(BaseButton) as typeof BaseButton;

export { StockButtonWithRef as BaseButton };
export type { BaseButtonProps };
