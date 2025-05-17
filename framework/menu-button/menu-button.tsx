import { Button, ButtonProps } from "../button";

interface MenuButtonProps extends ButtonProps {
	label?: React.ReactNode;
}

function MenuButton(props: MenuButtonProps) {
	const { label, ...buttonProps } = props;
	return <Button {...buttonProps}>{label}</Button>;
}

export { MenuButton };
export type { MenuButtonProps };
