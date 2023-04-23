import { createDefferedFunction } from "../utils/function";
import { PositionConfig, createPositionObserver } from "../utils/position";
import { useEffect, useState } from "react";

function usePosition(config: PositionConfig = {}) {
	const { align, alignItem, flip, position } = config;
	const [target, setTarget] = useState<HTMLElement | null>(null);
	const [floating, setfloating] = useState<HTMLElement | null>(null);
	const [style, setStyle] = useState<React.CSSProperties>({});

	useEffect(() => {
		const deferredSetStyle = createDefferedFunction(setStyle, 100);
		return target == null || floating == null
			? undefined
			: createPositionObserver({
					align,
					alignItem,
					flip,
					position,
					target,
					floating,
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
	}, [target, floating, align, alignItem, flip, position]);

	return {
		style,
		refs: {
			reference: target,
			setReference: setTarget,
			floating,
			setfloating,
		},
	};
}

export { usePosition };
export type { PositionConfig };
