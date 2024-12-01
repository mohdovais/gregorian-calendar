import { classname } from "../utils/classname";
import style from "./StockButton.module.css";
import { forwardRef } from "react";

interface StockButtonProps
	extends React.DetailedHTMLProps<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> {
	active?: boolean;
}

function StockButton(
	props: StockButtonProps,
	ref?: React.LegacyRef<HTMLButtonElement>,
) {
	const { active, children, className, type = "button", ...restProps } = props;
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

const StockButtonWithRef = forwardRef(StockButton) as typeof StockButton;

export { StockButtonWithRef as StockButton };
export type { StockButtonProps };
