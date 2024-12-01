import { useEffect, useState } from "react";
import { createDefferedFunction } from "../utils/function";
import { PositionConfig, createPositionObserver } from "../utils/position";

function usePosition<
	TargetElement extends HTMLElement = HTMLElement,
	FloatingElement extends HTMLElement = HTMLElement,
>(show = false, settings?: PositionConfig) {
	const [reference, setReference] = useState<TargetElement | null>(null);
	const [floating, setFloating] = useState<FloatingElement | null>(null);
	const [style, setStyle] = useState<React.CSSProperties>({});

	useEffect(() => {
		const deferredSetStyle = createDefferedFunction(setStyle, 100);
		return !show || reference == null || floating == null
			? undefined
			: createPositionObserver(
					reference,
					floating,
					(css) => {
						const style = floating.style;
						const { bottom, left, right, top } = css;
						style.position = css.position;
						style.visibility = show ? "visible" : "hidden";
						style.willChange = "visibility";
						style.top = top == null ? "" : `${top}px`;
						style.right = right == null ? "" : `${right}px`;
						style.bottom = bottom == null ? "" : `${bottom}px`;
						style.left = left == null ? "" : `${left}px`;

						deferredSetStyle(css);
					},
					settings,
			  );
	}, [show, reference, floating, settings]);

	return {
		style,
		refs: {
			reference,
			setReference,
			floating,
			setFloating,
		},
	};
}

export { usePosition };
