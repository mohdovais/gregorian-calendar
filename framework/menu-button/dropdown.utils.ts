const KEYBOARD_ACTION_TYPE_NONE = 0;
const KEYBOARD_ACTION_TYPE_Close = 1;
const KEYBOARD_ACTION_TYPE_CloseSelect = 2;
const KEYBOARD_ACTION_TYPE_SelectFirst = 3;
const KEYBOARD_ACTION_TYPE_SelectLast = 4;
const KEYBOARD_ACTION_TYPE_SelectNext = 5;
const KEYBOARD_ACTION_TYPE_Open = 6;
const KEYBOARD_ACTION_TYPE_PageDown = 7;
const KEYBOARD_ACTION_TYPE_PageUp = 8;
const KEYBOARD_ACTION_TYPE_SelectPrevious = 9;
const KEYBOARD_ACTION_TYPE_Type = 10;

type KeyboardAction_None = {
    type: typeof KEYBOARD_ACTION_TYPE_NONE;
};

type KeyboardAction_Close = {
    type: typeof KEYBOARD_ACTION_TYPE_Close;
};

type KeyboardAction_CloseSelect<T> = {
    type: typeof KEYBOARD_ACTION_TYPE_CloseSelect;
    onChange: undefined | ((value: T) => void);
};

type KeyboardAction_SelectFirst = {
    type: typeof KEYBOARD_ACTION_TYPE_SelectFirst;
};

type KeyboardAction_SelectLast = {
    type: typeof KEYBOARD_ACTION_TYPE_SelectLast;
};

type KeyboardAction_SelectNext = {
    type: typeof KEYBOARD_ACTION_TYPE_SelectNext;
};

type KeyboardAction_SelectPrevious = {
    type: typeof KEYBOARD_ACTION_TYPE_SelectPrevious;
};

type KeyboardAction_Open<T> = {
    type: typeof KEYBOARD_ACTION_TYPE_Open;
    values: T[];
};

type KeyboardAction_PageDown = {
    type: typeof KEYBOARD_ACTION_TYPE_PageDown;
};

type KeyboardAction_PageUp = {
    type: typeof KEYBOARD_ACTION_TYPE_PageUp;
};

type KeyboardAction_Type = {
    type: typeof KEYBOARD_ACTION_TYPE_Type;
};

type KeyboardAction<T> =
    | KeyboardAction_Close
    | KeyboardAction_CloseSelect<T>
    | KeyboardAction_SelectFirst
    | KeyboardAction_SelectLast
    | KeyboardAction_SelectNext
    | KeyboardAction_SelectPrevious
    | KeyboardAction_Open<T>
    | KeyboardAction_PageDown
    | KeyboardAction_PageUp
    | KeyboardAction_Type
    | KeyboardAction_None;

// all keys that will do the default open action
const openKeys = ["ArrowDown", "ArrowUp", "Enter", " "];

function getActionFromKeyboardEvent<T>(
    event: React.KeyboardEvent,
    expanded: boolean,
    values: T[],
    onChange: ((value: T) => void) | undefined,
): KeyboardAction<T> {
    const { key, altKey, ctrlKey, metaKey } = event;

    // handle opening when closed
    if (!expanded && openKeys.includes(key)) {
        event.preventDefault();
        return {
            type: KEYBOARD_ACTION_TYPE_Open,
            values,
        };
    }

    // home and end move the selected option when open or closed
    if (key === "Home") {
        event.preventDefault();
        return {
            type: KEYBOARD_ACTION_TYPE_SelectFirst,
        };
    }
    if (key === "End") {
        event.preventDefault();
        return {
            type: KEYBOARD_ACTION_TYPE_SelectLast,
        };
    }

    // handle typing characters when open or closed
    if (
        key === "Backspace" ||
        key === "Clear" ||
        (key.length === 1 && key !== " " && !altKey && !ctrlKey && !metaKey)
    ) {
        return {
            type: KEYBOARD_ACTION_TYPE_Type,
        };
    }

    // handle keys when open
    if (expanded) {
        if (key === "ArrowUp" && altKey) {
            event.preventDefault();
            return {
                type: KEYBOARD_ACTION_TYPE_CloseSelect,
                onChange,
            };
        } else if (key === "ArrowDown" && !altKey) {
            event.preventDefault();
            return {
                type: KEYBOARD_ACTION_TYPE_SelectNext,
            };
        } else if (key === "ArrowUp") {
            event.preventDefault();
            return {
                type: KEYBOARD_ACTION_TYPE_SelectPrevious,
            };
        } else if (key === "PageUp") {
            event.preventDefault();
            return {
                type: KEYBOARD_ACTION_TYPE_PageUp,
            };
        } else if (key === "PageDown") {
            event.preventDefault();
            return {
                type: KEYBOARD_ACTION_TYPE_PageDown,
            };
        } else if (key === "Escape") {
            event.preventDefault();
            return {
                type: KEYBOARD_ACTION_TYPE_Close,
            };
        } else if (key === "Enter" || key === " ") {
            event.preventDefault();
            return {
                type: KEYBOARD_ACTION_TYPE_CloseSelect,
                onChange,
            };
        }
    }

    return {
        type: KEYBOARD_ACTION_TYPE_NONE,
    };
}

export {
    getActionFromKeyboardEvent,
    KEYBOARD_ACTION_TYPE_Close,
    KEYBOARD_ACTION_TYPE_CloseSelect,
    KEYBOARD_ACTION_TYPE_NONE,
    KEYBOARD_ACTION_TYPE_Open,
    KEYBOARD_ACTION_TYPE_PageDown,
    KEYBOARD_ACTION_TYPE_PageUp,
    KEYBOARD_ACTION_TYPE_SelectFirst,
    KEYBOARD_ACTION_TYPE_SelectLast,
    KEYBOARD_ACTION_TYPE_SelectNext,
    KEYBOARD_ACTION_TYPE_SelectPrevious,
    KEYBOARD_ACTION_TYPE_Type,
};

export type {
    KeyboardAction,
    KeyboardAction_Close,
    KeyboardAction_CloseSelect,
    KeyboardAction_None,
    KeyboardAction_Open,
    KeyboardAction_PageDown,
    KeyboardAction_PageUp,
    KeyboardAction_SelectFirst,
    KeyboardAction_SelectLast,
    KeyboardAction_SelectNext,
    KeyboardAction_SelectPrevious,
    KeyboardAction_Type,
};
