type PositionConfig = {
	position?: "top" | "right" | "bottom" | "left";
	align?: "start" | "end" | "middle";
	alignItem?: "start" | "end" | "middle";
	flip?: boolean;
	gap?: number;
};

type ResultStyle = {
	position: Exclude<React.CSSProperties["position"], undefined>;
	top?: React.CSSProperties["top"];
	right?: React.CSSProperties["right"];
	bottom?: React.CSSProperties["bottom"];
	left?: React.CSSProperties["left"];
};

type Dimension = {
	width: number;
	height: number;
};

const defaultFixedCssStyle: ResultStyle = Object.freeze({
	position: "fixed",
	left: 0,
	top: 0,
});

const win = globalThis;

const getDimension = (el: HTMLElement): Dimension => ({
	width: el.offsetWidth,
	height: el.offsetHeight,
});

const createPositionObserver = (
	target: HTMLElement,
	floating: HTMLElement,
	onChange: (css: ResultStyle) => void,
	settings?: PositionConfig,
) => {
	let isVisible = false;
	let busy = false;
	let lastStyle: ResultStyle;

	const calculate = (targetRect: DOMRectReadOnly, floatingRect: Dimension) => {
		const newStyle = isVisible
			? (Object.assign(
					{
						position: "fixed",
					},
					calculateFixedPosition(targetRect, floatingRect, settings),
			  ) as ResultStyle)
			: defaultFixedCssStyle;

		if (lastStyle !== newStyle) {
			lastStyle = newStyle;
			onChange(newStyle);
		}
	};

	const doCalculate = () => {
		if (isVisible && !busy) {
			win.requestAnimationFrame(() => {
				calculate(target.getBoundingClientRect(), getDimension(floating));
				busy = false;
			});
			busy = true;
		}
	};

	const observer = new IntersectionObserver(
		(entries) => {
			const entry = entries[0];
			isVisible = entry.isIntersecting;
			calculate(entry.boundingClientRect, getDimension(floating));
		},
		{ threshold: 1 },
	);

	const dispose = () => {
		observer.disconnect();
		win.removeEventListener("scroll", doCalculate, true);
		win.removeEventListener("resize", doCalculate, true);
	};

	observer.observe(target);
	win.addEventListener("scroll", doCalculate, true);
	win.addEventListener("resize", doCalculate, true);
	doCalculate();

	return dispose;
};

function calculateFixedPosition(
	targetRect: DOMRectReadOnly,
	floatingDimension: Dimension,
	settings: PositionConfig = {},
) {
	const {
		align = "start",
		alignItem = "start",
		flip = true,
		gap = 0,
		position = "bottom",
	} = settings;

	return doCalculateFixedPosition(
		targetRect,
		floatingDimension,
		position,
		align,
		alignItem,
		flip,
		gap,
	);
}

function doCalculateFixedPosition(
	targetRect: DOMRectReadOnly,
	floatingDimension: Dimension,
	position: Required<PositionConfig>["position"],
	align: Required<PositionConfig>["align"],
	alignItem: Required<PositionConfig>["alignItem"],
	flip: Required<PositionConfig>["flip"],
	gap: Required<PositionConfig>["gap"],
): Omit<ResultStyle, "position"> {
	const targetRectTop = targetRect.top;
	const targetRectLeft = targetRect.left;
	const targetRectBottom = targetRect.bottom;
	const targetRectRight = targetRect.right;
	const floatingRectWidth = floatingDimension.width;
	const floatingRectHeight = floatingDimension.height;

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
			return flip === true &&
				floatingRectHeight > spaceBottom &&
				targetRectTop > spaceBottom
				? doCalculateFixedPosition(
						targetRect,
						floatingDimension,
						"top",
						align,
						alignItem,
						false,
						gap,
				  )
				: {
						left: targetRectLeft + deltaAlignX - deltaAlignItemX,
						top: targetRectBottom + gap,
				  };
		}
		case "top": {
			return flip &&
				floatingRectHeight > targetRectTop &&
				spaceBottom > targetRectTop
				? doCalculateFixedPosition(
						targetRect,
						floatingDimension,
						"bottom",
						align,
						alignItem,
						false,
						gap,
				  )
				: {
						left: targetRectLeft + deltaAlignX - deltaAlignItemX,
						bottom: window.innerHeight - targetRectTop + gap,
				  };
		}
		case "left": {
			return flip &&
				floatingRectWidth > targetRectLeft &&
				spaceRight > targetRectLeft
				? doCalculateFixedPosition(
						targetRect,
						floatingDimension,
						"right",
						align,
						alignItem,
						false,
						gap,
				  )
				: {
						top: targetRectTop + deltaAlignY - deltaAlignItemY,
						right: window.innerWidth - targetRectLeft + gap,
				  };
		}
		case "right": {
			return flip &&
				floatingRectWidth > spaceRight &&
				targetRectLeft > spaceRight
				? doCalculateFixedPosition(
						targetRect,
						floatingDimension,
						"left",
						align,
						alignItem,
						false,
						gap,
				  )
				: {
						top: targetRectTop + deltaAlignY - deltaAlignItemY,
						left: targetRectRight + gap,
				  };
		}
	}
}

export { createPositionObserver, calculateFixedPosition };

export type { PositionConfig };
