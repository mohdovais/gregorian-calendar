import { createDefferedFunction } from "../utils/function";
import { PositionConfig, createPositionObserver } from "../utils/position";
import { useEffect, useState } from "react";

type UsePositionConfig = {
	show?: boolean;
	settings?: PositionConfig;
};

function usePosition<
	TargetElement extends HTMLElement = HTMLElement,
	FloatingElement extends HTMLElement = HTMLElement,
>(config: UsePositionConfig = {}) {
	const { show = false, settings = {} } = config;
	const [target, setTarget] = useState<TargetElement | null>(null);
	const [floating, setFloating] = useState<FloatingElement | null>(null);
	const [style, setStyle] = useState<React.CSSProperties>({});

	useEffect(() => {
		const deferredSetStyle = createDefferedFunction(setStyle, 100);
		return !show || target == null || floating == null
			? undefined
			: createPositionObserver({
					target,
					floating,
					settings,
					onChange: (css) => {
						const style = floating.style;
						const {
							position,
							visibility,
							willChange,
							bottom,
							left,
							right,
							top,
						} = css;
						style.position = position;
						style.visibility = visibility;
						style.willChange = willChange;
						style.top = top == null ? "" : top + "px";
						style.right = right == null ? "" : right + "px";
						style.bottom = bottom == null ? "" : bottom + "px";
						style.left = left == null ? "" : left + "px";

						deferredSetStyle(css);
					},
			  });
	}, [
		target,
		floating,
		settings.align,
		settings.alignItem,
		settings.flip,
		settings.position,
		settings.gap,
		show,
	]);

	return {
		style,
		refs: {
			reference: target,
			setReference: setTarget,
			floating,
			setFloating,
		},
	};
}

export { usePosition };
export type { UsePositionConfig };
