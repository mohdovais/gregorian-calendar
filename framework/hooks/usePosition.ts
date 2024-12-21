import { useEffect, useState } from "react";
import { createDefferedFunction } from "../utils/function";
import {
	createPositionObserver,
	PositionConfig,
	ResultStyle,
} from "../utils/position";

function usePosition<
	TargetElement extends HTMLElement = HTMLElement,
	FloatingElement extends HTMLElement = HTMLElement,
>(show = false, settings?: PositionConfig) {
	const [reference, setReference] = useState<TargetElement | null>(null);
	const [floating, setFloating] = useState<FloatingElement | null>(null);
	const [style, setStyle] = useState<ResultStyle>(
		{} as unknown as ResultStyle,
	);

	useEffect(() => {
		if (show && reference != null && floating != null) {
			const deferredSetStyle = createDefferedFunction(setStyle, 100);
			return createPositionObserver(
				reference,
				floating,
				(css) => {
					const style = floating.style;
					const { bottom, left, right, top } = css;
					style.position = css.position || "";
					style.visibility = show && top !== 0 && left !== 0
						? "visible"
						: "hidden";
					style.willChange = "visibility";
					style.top = top == null ? "" : `${top}px`;
					style.right = right == null ? "" : `${right}px`;
					style.bottom = bottom == null ? "" : `${bottom}px`;
					style.left = left == null ? "" : `${left}px`;

					deferredSetStyle(css);
				},
				settings,
			);
		}

		setStyle({} as unknown as ResultStyle);
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
export type { ResultStyle };
