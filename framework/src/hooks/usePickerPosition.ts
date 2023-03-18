import { autoPlacement, useFloating } from "@floating-ui/react-dom";

function usePickerPosition(open: boolean) {
	const { x, y, strategy, refs } = useFloating({
		open,
		middleware: [
			autoPlacement({
				crossAxis: true,
				allowedPlacements: [
					"bottom-end",
					"bottom-start",
					"top-end",
					"top-start",
				],
			}),
		],
	});

	return {
		refs,
		floatStyle: {
			position: strategy,
			top: y ?? 0,
			left: x ?? 0,
			width: "max-content",
			display: "inline-block",
			padding: 20,
		},
	};
}

export { usePickerPosition };
