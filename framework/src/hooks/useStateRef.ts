import { useRef } from "react";

function useStateRef<T>(state: T) {
	const stateRef = useRef(state);
	stateRef.current = state;
	return stateRef;
}

export { useStateRef };
