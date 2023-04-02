import { createPortal } from "react-dom";

type PortalProps<T> = {
	children:
		| React.ReactElement<T, string | React.JSXElementConstructor<T>>
		| React.ReactFragment;
};

const div = document.createElement("div");
div.className = "portal";
document.body.appendChild(div);

function Portal<T>(props: PortalProps<T>) {
	return createPortal(props.children, div);
}

export { Portal };
