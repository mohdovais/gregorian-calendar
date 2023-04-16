import { Button, ButtonProps } from "../button";
import { useId } from "../hooks/useId";
import { Menu, MenuGroupOrItem } from "../menu";
import { Portal } from "../portal";
import { noop } from "../utils/function";
import { autoPlacement, useFloating } from "@floating-ui/react-dom";
import { useCallback, useEffect, useState } from "react";

interface MenuButtonProps<T> extends Omit<ButtonProps, "onSelect"> {
	items: MenuGroupOrItem<T>[];
	onBeforeSelect?: (option: T) => void | boolean;
	onSelect?: (option: T) => void;
}

type RequiredProp<T, U extends keyof MenuButtonProps<T>> = Required<
	MenuButtonProps<T>
>[U];

function MenuButton<T>(props: MenuButtonProps<T>) {
	const {
		items,
		children,
		onClick = noop as RequiredProp<T, "onClick">,
		onSelect = noop as RequiredProp<T, "onSelect">,
		onBeforeSelect = noop as RequiredProp<T, "onBeforeSelect">,
		...btnProps
	} = props;

	const [expanded, setExpanded] = useState(false);
	const menuId = useId("menu-");
	const { x, y, strategy, refs } = useFloating({
		open: expanded,
		strategy: "fixed",
		middleware: [
			autoPlacement({
				crossAxis: true,
				alignment: "end",
			}),
		],
	});

	useEffect(() => {
		// @TODO: should be event not effect
		if (expanded && refs.floating.current) {
			refs.floating.current.focus();
		}
	}, [expanded, refs.floating.current]);

	const collpase = useCallback(() => {
		setExpanded(false);
		//refs.reference.current?.focus();
	}, []);

	const selectHandler = useCallback(
		(value: T) => {
			if (onBeforeSelect(value) !== false) {
				collpase();
				onSelect(value);
			}
		},
		[onBeforeSelect, onSelect],
	);

	return (
		<>
			<Button
				{...btnProps}
				onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
					setExpanded(!expanded);
					onClick(event);
				}}
				ref={refs.setReference}
				active={expanded}
				aria-haspopup={true}
				aria-controls={menuId}
				aria-expanded={expanded}
			>
				{children}
			</Button>
			<Portal>
				<Menu
					id={menuId}
					expanded={expanded}
					items={items}
					onSelect={selectHandler}
					style={{
						position: strategy,
						top: y ?? 0,
						left: x ?? 0,
					}}
					ref={refs.setFloating}
					onCollapse={collpase}
				/>
			</Portal>
		</>
	);
}

export { MenuButton };
