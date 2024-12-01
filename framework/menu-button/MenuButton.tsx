import { useState } from "react";
import { Button, ButtonProps } from "../button";
import { useEnsuredId } from "../hooks/useId";
import { usePosition } from "../hooks/usePosition";
import { headlessListbox } from "../listbox/Listbox.store";
import { Portal } from "../portal";
import css from "./MenuButton.module.css";

interface MenuButtonProps<T> extends Omit<ButtonProps, "onSelect"> {
	label: string;
	children?: React.ReactElement | React.ReactElement[];
	onBeforeSelect?: (option: T) => boolean;
	onSelect?: (option: T) => void;
}

function MenuButton<T>(props: MenuButtonProps<T>) {
	const { className, id, label, children, onSelect, onClick, ...btnProps } =
		props;
	const [expanded, setExpanded] = useState(false);
	const { style, refs } = usePosition(expanded);
	const { activeId, items, eventListeners } = headlessListbox(
		props.children,
		null,
		onSelect,
	);

	const listboxId = useEnsuredId("listbox-", id);

	return (
		<>
			<Button
				{...btnProps}
				ref={refs.setReference}
				active={expanded}
				aria-haspopup={true}
				aria-controls={listboxId}
				aria-expanded={expanded}
				aria-activedescendant={activeId}
				onKeyDown={expanded ? eventListeners.onKeyDown : undefined}
				onClick={() => {
					setExpanded((expanded) => !expanded);
				}}
			>
				{label}
			</Button>
			<Portal>
				<div ref={refs.setFloating} style={style}>
					{expanded ? (
						<div
							id={listboxId}
							className={css.menu}
							role="listbox"
							tabIndex={0}
							aria-activedescendant={activeId}
						>
							{items}
						</div>
					) : null}
				</div>
			</Portal>
		</>
	);
}

export { MenuButton };
