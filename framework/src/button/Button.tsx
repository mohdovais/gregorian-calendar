import { classname } from "../utils/classname";
import style from "./Button.module.css";
import { StockButton } from "./StockButton";
import { ReactNode } from "react";

const COLOR_PRIMARY = "primary";
const COLOR_NEUTRAL = "neutral";
const COLOR_DANGER = "danger";
const COLOR_WARNING = "warning";
const COLOR_INFO = "info";
const COLOR_SUCCESS = "success";

const UI_SOLID = "solid";
const UI_OUTLINED = "outlined";
const UI_LINK = "link";
const UI_GHOST = "ghost";

type Color =
	| typeof COLOR_NEUTRAL
	| typeof COLOR_DANGER
	| typeof COLOR_INFO
	| typeof COLOR_PRIMARY
	| typeof COLOR_SUCCESS
	| typeof COLOR_WARNING;

type UI =
	| typeof UI_GHOST
	| typeof UI_LINK
	| typeof UI_OUTLINED
	| typeof UI_SOLID;

interface ButtonProps
	extends React.DetailedHTMLProps<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> {
	color?: Color;
	ui?: UI;
	icon?: ReactNode;
}

const getColorClassName = (color?: Color) => {
	switch (color) {
		case COLOR_DANGER:
			return style.danger;
		case COLOR_INFO:
			return style.info;
		case COLOR_PRIMARY:
			return style.primary;
		case COLOR_SUCCESS:
			return style.success;
		case COLOR_WARNING:
			return style.warning;
		default:
			return style.neutral;
	}
};

const getUiClassName = (ui?: UI) => {
	switch (ui) {
		case UI_GHOST:
			return style.ghost;
		case UI_LINK:
			return style.link;
		case UI_OUTLINED:
			return style.outlined;
		default:
			return style.solid;
	}
};

function Button(props: ButtonProps) {
	const {
		ui,
		color,
		icon,
		children,
		className,
		type = "button",
		...restProps
	} = props;
	return (
		<StockButton
			{...restProps}
			className={classname(
				style.btn,
				getUiClassName(ui),
				getColorClassName(color),
				className,
			)}
			type={type}
		>
			<span className={style.icon}>{icon}</span>
			<span className={style.text}>{children}</span>
		</StockButton>
	);
}

export { Button };
export type { ButtonProps };
