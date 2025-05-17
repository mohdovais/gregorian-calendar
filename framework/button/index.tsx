import { forwardRef, JSX, ReactNode } from "react";
import { classNames } from "../utils/string";
import { BaseButton, BaseButtonProps } from "../base-button";

import css from "./Button.module.css";

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

interface ButtonProps extends BaseButtonProps {
	color?: Color;
	ui?: UI;
	icon?: ReactNode;
}

function getColorClassName(color?: Color) {
	switch (color) {
		case COLOR_DANGER:
			return css.danger;
		case COLOR_INFO:
			return css.info;
		case COLOR_PRIMARY:
			return css.primary;
		case COLOR_SUCCESS:
			return css.success;
		case COLOR_WARNING:
			return css.warning;
		default:
			return css.neutral;
	}
}

const getUiClassName = (ui?: UI) => {
	switch (ui) {
		case UI_GHOST:
			return css.ghost;
		case UI_LINK:
			return css.link;
		case UI_OUTLINED:
			return css.outlined;
		default:
			return css.solid;
	}
};

function Button(
	props: ButtonProps,
	ref?: React.Ref<HTMLButtonElement>,
): JSX.Element {
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
		<BaseButton
			{...restProps}
			className={classNames(
				css.btn,
				getUiClassName(ui),
				getColorClassName(color),
				className,
			)}
			type={type}
			ref={ref}
		>
			{icon == null ? null : <span className={css.icon}>{icon}</span>}
			{children == null
				? null
				: <span className={css.text}>{children}</span>}
		</BaseButton>
	);
}

const ButtonWithRef = forwardRef(Button) as typeof Button;

export { ButtonWithRef as Button };
export type { ButtonProps };
