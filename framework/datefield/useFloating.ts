import {
    autoPlacement,
    computePosition,
    ComputePositionConfig,
    shift,
} from "@floating-ui/dom";
import {
    startTransition,
    useCallback,
    useDeferredValue,
    useEffect,
    useReducer,
} from "react";
import { copy } from "../utils/object";

type FloatingState = {
    floating: HTMLElement | null;
    reference: HTMLElement | null;
    floatingStyle: React.CSSProperties;
    placement: "top" | "bottom";
};

type ActionSetReference = {
    type: 0;
    reference: HTMLElement | null;
};

type ActionSetFloating = {
    type: 1;
    floating: HTMLElement | null;
};

type ActionSetStyle = {
    type: 2;
    style: React.CSSProperties;
    placement: "top" | "bottom";
};

type FloatingAction = ActionSetFloating | ActionSetReference | ActionSetStyle;

function reducer(
    state: FloatingState,
    action: FloatingAction,
): FloatingState {
    switch (action.type) {
        case 0:
            return copy(state, { reference: action.reference });
        case 1:
            return copy(state, { floating: action.floating });
        case 2:
            return copy(state, {
                floatingStyle: action.style,
                placement: action.placement,
            });
        default:
            return state;
    }
}

const defaultState: FloatingState = {
    floating: null,
    reference: null,
    floatingStyle: {},
    placement: "bottom",
};

const positionConfig: Partial<ComputePositionConfig> = {
    strategy: "fixed",
    placement: "bottom-start",
    middleware: [
        autoPlacement({
            allowedPlacements: ["top", "bottom"],
        }),
        shift(),
    ],
};

function useFloating(show: boolean = false) {
    const [state, dispatch] = useReducer(reducer, defaultState);

    const setReference = useCallback((reference: HTMLElement | null) => {
        dispatch({ type: 0, reference });
    }, []);

    const setFloating = useCallback((floating: HTMLElement | null) => {
        dispatch({ type: 1, floating });
    }, []);

    const { floating, reference, floatingStyle, placement } = state;
    const deferredFloatingStyle = useDeferredValue(floatingStyle);

    useEffect(() => {
        const abortController = new AbortController();
        let resizeObserver: ResizeObserver;

        if (show && floating != null && reference != null) {
            const compute = () => {
                computePosition(reference, floating, positionConfig).then(
                    (result) => {
                        const { placement, strategy, x, y } = result;
                        const isBottom = placement === "bottom-start";

                        const style: React.CSSProperties = {
                            position: strategy,
                            left: `${x}px`,
                            top: `${y}px`,
                        };

                        Object.assign(floating.style, style);

                        startTransition(() => {
                            dispatch({
                                type: 2,
                                placement: isBottom ? "bottom" : "top",
                                style,
                            });
                        });
                    },
                );
            };

            compute();

            resizeObserver = new ResizeObserver(compute);
            resizeObserver.observe(floating);

            window.addEventListener("resize", compute, {
                signal: abortController.signal,
            });
            window.addEventListener("scroll", compute, {
                signal: abortController.signal,
            });
        }

        return () => {
            abortController.abort();
            resizeObserver?.disconnect();
        };
    }, [show, floating, reference]);

    return {
        floating,
        reference,
        setReference,
        setFloating,
        floatingStyle: deferredFloatingStyle,
        placement,
    };
}

export { useFloating };
