import { useState } from "react";
import { ResultStyle, usePosition } from "../hooks/usePosition";
import { Portal } from "../portal";
import { ensureArray } from "../utils/array";
import { classname } from "../utils/classname";
import css from "./dropdown.module.css";

const positionSettings = {
	transform: (css: ResultStyle, target: HTMLElement) => {
		const draft = Object.assign({}, css);
		const { top, left, maxHeight } = draft;
		if (top != null && top !== 0) {
			draft.top = top - 58;
		}

		if (left != null && left !== 0) {
			draft.left = left - 10;
		}

		if (maxHeight != null) {
			draft.maxHeight = maxHeight + 48;
		}

		// @ts-expect-error
		draft.width = target.offsetWidth + 20;
		return draft;
	},
};

type DisplayComponentProps = {};

interface DropdownProps<T> extends React.PropsWithChildren {
	name?: string;
	label: string;
	value: T;
	data: T[];
	required?: boolean;
	readonly?: boolean;
	disabled?: boolean;
	displayComponent: React.FunctionComponent<DisplayComponentProps>;
}

function Dropdown<T>(props: DropdownProps<T>) {
	const { name, label, required, readonly, disabled, children } = props;
	const [expanded, setExpanded] = useState(false);
	const { refs, style } = usePosition(expanded, positionSettings);
	const values = ensureArray(props.value);
	const v = values.join("");

	return (
		<div
			className={classname(css.field, expanded && css.expanded)}
			onClick={() => setExpanded((x) => !x)}
		>
			<input
				name={name}
				type="hidden"
				required={required}
				value={v}
			/>
			<div
				className={classname(
					css.input,
					values.length > 0 && css.has_value,
					required && css.required,
					readonly && css.readonly,
					disabled && css.disabled,
				)}
				tabIndex={0}
				ref={refs.setReference}
			>
				{v}
			</div>
			<label className={css.label}>{label}</label>
			<Portal>
				<div
					ref={refs.setFloating}
					className={css.picker}
					style={style}
				>
					<div className={css.scroller}>{children}</div>
				</div>
			</Portal>
		</div>
	);
}

interface DropdownOptionProps<T> extends React.PropsWithChildren {
	value: T;
}

function Option<T>(props: DropdownOptionProps<T>) {
	return <div>{props.children}</div>;
}

Dropdown.Option = Option;

export { Dropdown };
