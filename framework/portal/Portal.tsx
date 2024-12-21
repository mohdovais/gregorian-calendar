import { createPortal } from "react-dom";

const div = document.createElement("div");
div.className = "portal";
document.body.appendChild(div);

function Portal(props: React.PropsWithChildren) {
	return createPortal(props.children, div);
}

export { Portal };
