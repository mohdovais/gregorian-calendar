import { autoPlacement, useFloating } from "@floating-ui/react-dom";
import { useEffect, useState } from "react";
import { Button } from "../button";
import { Menu, MenuGroupOrItem } from "../menu";

type MenuButtonProps<T> = {
	id?: string;
	className?: string;
	style?: React.CSSProperties;
	children: string | React.ReactElement;

	items: MenuGroupOrItem<T>[];
	onSelect?: (option: T) => void;
};

function MenuButton<T>(props: MenuButtonProps<T>) {
	const { items, children, className, id, onSelect, style } = props;
	const [open, setOpen] = useState(false);
	const { x, y, strategy, refs } = useFloating({
		open,
		middleware: [
			autoPlacement({
				crossAxis: true,
				alignment: "end",
			}),
		],
	});

	useEffect(() => {
		if (open && refs.floating.current) {
			refs.floating.current.focus();
		}
	}, [open, refs.floating.current]);

	return (
		<>
			<Button
				id={id}
				ui="outlined"
				className={className}
				style={style}
				onClick={() => setOpen(!open)}
				ref={refs.setReference}
				active={open}
			>
				{children}
			</Button>
			<Menu
				show={open}
				items={items}
				onSelect={onSelect}
				style={{
					position: strategy,
					top: y ?? 0,
					left: x ?? 0,
				}}
				ref={refs.setFloating}
			/>
		</>
	);
}

export { MenuButton };
