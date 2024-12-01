import { Input, InputProps } from "../input";
import { noop } from "../utils/function";
import style from "./MaskedInput.module.css";
import {
	InitializerArg,
	initializer,
	isNumericChar,
	onKeyDown,
	store,
} from "./store";
import { memo, useCallback, useEffect, useRef, useState } from "react";

interface MaskedFieldProps extends Omit<InputProps, "onChange"> {
	value?: string;
	onChange?: (value: string) => void;
}

function Mask(props: { mask: string }) {
	return props.mask === "" ? null : (
		<div className={style.mask}>
			{props.mask.split("").map((char, i) => (
				<span
					key={char + i}
					className={isNumericChar(char) ? style.num : undefined}
				>
					{char}
				</span>
			))}
		</div>
	);
}

const defaultValidater = () => "";

function MaskedField(props: MaskedFieldProps) {
	const {
		pattern,
		placeholder,
		value = "",
		inputMode = "numeric",
		onChange = noop,
		customValidity = defaultValidater,
		...inputProps
	} = props;

	const inputRef = useRef<HTMLInputElement>(null);
	const [state, setState] = useState(() =>
		initializer({ pattern, placeholder, value } as InitializerArg),
	);

	const { _value, mask, patternString, currentValue } = state;

	useEffect(() => {
		if (currentValue !== value) {
			setState((state) =>
				store(state, {
					type: "prop_v",
					value,
				}),
			);
		}
	}, [value, currentValue]);

	const changeHandler = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setState((state) => {
				const newState = store(state, {
					type: "input_v",
					value: event.target.value,
				});

				//hack
				if (
					newState.isValid &&
					newState._value !== newState.currentValue &&
					customValidity(newState._value) === ""
				) {
					setTimeout(onChange, 0, newState._value);
				}

				return newState;
			});
		},
		[onChange, customValidity],
	);

	return (
		<div className={style.wrapper}>
			<Mask mask={mask} />
			<Input
				{...inputProps}
				className={style.input}
				value={_value}
				pattern={patternString}
				inputMode={inputMode}
				onKeyDown={onKeyDown}
				onChange={changeHandler}
				customValidity={customValidity}
				ref={inputRef}
			/>
		</div>
	);
}

const MaskedFieldMemo = memo(MaskedField);

export { MaskedFieldMemo as MaskedField };
