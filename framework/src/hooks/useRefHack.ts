import { useRef } from "react";

function useRefHack<T>(state: T) {
	const stateRef = useRef(state);
	stateRef.current = state;
	return stateRef;
}

export { useRefHack };
