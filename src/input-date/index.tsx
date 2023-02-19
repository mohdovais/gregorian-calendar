import { Calendar, CalendarProps } from "../calendar";
import commonStyle from "../css/common.module.css";
import { autoPlacement, useFloating } from "@floating-ui/react-dom";
import { useState } from "react";

const formater = Intl.DateTimeFormat("en", {
	dateStyle: "medium",
});

function parse(event: React.ChangeEvent<HTMLInputElement>) {
	const str = event.target.value;
	if (isNaN(+str)) {
		const epoc = Date.parse(str);
		console.log(+str, epoc, formater.format(epoc));
	}
}

interface InputDate extends CalendarProps {}

function InputDate(props: InputDate) {
	const [isOpen, setIsOpen] = useState(false);
	const { x, y, strategy, refs } = useFloating({
		open: isOpen,
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

	return (
		<>
			<input
				type="text"
				onChange={parse}
				ref={refs.setReference}
				onFocus={() => setIsOpen(true)}
			/>
			{isOpen ? (
				<Calendar
					ref={refs.setFloating}
					className={commonStyle.window}
					style={{
						position: strategy,
						top: y ?? 0,
						left: x ?? 0,
						width: "max-content",
						display: "inline-block",
						padding: 20,
					}}
					onSelect={console.log}
				/>
			) : null}
		</>
	);
}

export { InputDate };
