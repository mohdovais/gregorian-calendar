import { classname } from "../utils/classname";
import style from "./StockButton.module.css";

interface StockButtonProps
	extends React.DetailedHTMLProps<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> {}

function StockButton(props: StockButtonProps) {
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

export { StockButton };
export type { StockButtonProps };
