type PositionConfig = {
	position?: "top" | "right" | "bottom" | "left";
	align?: "start" | "end" | "middle";
	alignItem?: "start" | "end" | "middle";
	flip?: boolean;
	gap?: number;
};

type CreatePositionConfig = PositionConfig & {
	target: HTMLElement;
	floating: HTMLElement;
	onChange: (css: ResultCSSProperties) => void;
};

type RequiredCSSProperties = Required<React.CSSProperties>;

type ResultCSSProperties = {
	position: RequiredCSSProperties["position"];
	visibility: RequiredCSSProperties["visibility"];
	willChange: RequiredCSSProperties["willChange"];
	top?: React.CSSProperties["top"];
	right?: React.CSSProperties["right"];
	bottom?: React.CSSProperties["bottom"];
	left?: React.CSSProperties["left"];
};

type Dimension = {
	width: number;
	height: number;
};

const defaultFixedCssStyle: ResultCSSProperties = Object.freeze({
	position: "fixed",
	willChange: "visibility",
	visibility: "hidden",
	left: 0,
	top: 0,
});

const win = globalThis;

const getDimension = (el: HTMLElement): Dimension => ({
	width: el.offsetWidth,
	height: el.offsetHeight,
});

const createPositionObserver = (config: CreatePositionConfig) => {
	const {
		onChange,
		target,
		floating,
		position = "bottom",
		align = "start",
		alignItem = "start",
		flip = true,
	} = config;
	let isVisible = false;
	let busy = false;
	let lastStyle: ResultCSSProperties;

	const calculate = (targetRect: DOMRectReadOnly, floatingRect: Dimension) => {
		const newStyle = isVisible
			? (Object.assign(
					{
						position: "fixed",
						willChange: "visibility",
						visibility: "visible",
					},
					calculateFixedPosition(
						targetRect,
						floatingRect,
						position,
						align,
						alignItem,
						flip,
					),
			  ) as ResultCSSProperties)
			: defaultFixedCssStyle;

		if (lastStyle !== newStyle) {
			lastStyle = newStyle;
			onChange(newStyle);
		}
	};

	let observer = new IntersectionObserver(
		(entries) => {
			const entry = entries[0];
			isVisible = entry.isIntersecting;
			calculate(entry.boundingClientRect, getDimension(floating));
		},
		{ threshold: 1 },
	);

	const onScroll = () => {
		if (isVisible && !busy) {
			win.requestAnimationFrame(() => {
				calculate(target.getBoundingClientRect(), getDimension(floating));
				busy = false;
			});
			busy = true;
		}
	};

	observer.observe(target);
	win.addEventListener("scroll", onScroll, true);
	win.addEventListener("resize", onScroll, true);

	return () => {
		observer.disconnect();
		win.removeEventListener("scroll", onScroll, true);
		win.removeEventListener("resize", onScroll, true);
		// rome-ignore lint/suspicious/noExplicitAny: setting observer to null for Garbage Collection
		observer = null as any;
	};
};

function calculateFixedPosition(
	targetRect: DOMRectReadOnly,
	floatingRect: Dimension,
	position: Required<PositionConfig>["position"],
	align: Required<PositionConfig>["align"],
	alignItem: Required<PositionConfig>["alignItem"],
	flip: Required<PositionConfig>["flip"],
): Omit<ResultCSSProperties, "position" | "willChange" | "visibility"> {
	const targetRectTop = targetRect.top;
	const targetRectLeft = targetRect.left;
	const targetRectBottom = targetRect.bottom;
	const targetRectRight = targetRect.right;
	const floatingRectWidth = floatingRect.width;
	const floatingRectHeight = floatingRect.height;

	const spaceBottom = window.innerHeight - targetRectBottom;
	const spaceRight = window.innerWidth - targetRectRight;

	const deltaAlignX =
		align === "start"
			? 0
			: align === "middle"
			? targetRect.width / 2
			: targetRect.width;

	const deltaAlignY =
		align === "start"
			? 0
			: align === "middle"
			? targetRect.height / 2
			: targetRect.height;

	const deltaAlignItemX =
		alignItem === "start"
			? 0
			: alignItem === "middle"
			? floatingRectWidth / 2
			: floatingRectWidth;

	const deltaAlignItemY =
		alignItem === "start"
			? 0
			: alignItem === "middle"
			? floatingRectHeight / 2
			: floatingRectHeight;

	switch (position) {
		case "bottom": {
			return flip &&
				floatingRectHeight > spaceBottom &&
				targetRectTop > spaceBottom
				? calculateFixedPosition(
						targetRect,
						floatingRect,
						"top",
						align,
						alignItem,
						false,
				  )
				: {
						left: targetRectLeft + deltaAlignX - deltaAlignItemX,
						top: targetRectBottom,
				  };
		}
		case "top": {
			return flip &&
				floatingRectHeight > targetRectTop &&
				spaceBottom > targetRectTop
				? calculateFixedPosition(
						targetRect,
						floatingRect,
						"bottom",
						align,
						alignItem,
						false,
				  )
				: {
						left: targetRectLeft + deltaAlignX - deltaAlignItemX,
						bottom: window.innerHeight - targetRectTop,
				  };
		}
		case "left": {
			return flip &&
				floatingRectWidth > targetRectLeft &&
				spaceRight > targetRectLeft
				? calculateFixedPosition(
						targetRect,
						floatingRect,
						"right",
						align,
						alignItem,
						false,
				  )
				: {
						top: targetRectTop + deltaAlignY - deltaAlignItemY,
						right: window.innerWidth - targetRectLeft,
				  };
		}
		case "right": {
			return flip &&
				floatingRectWidth > spaceRight &&
				targetRectLeft > spaceRight
				? calculateFixedPosition(
						targetRect,
						floatingRect,
						"left",
						align,
						alignItem,
						false,
				  )
				: {
						top: targetRectTop + deltaAlignY - deltaAlignItemY,
						left: targetRectRight,
				  };
		}
	}
}

export { createPositionObserver };

export type { PositionConfig };
