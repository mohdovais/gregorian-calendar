import { createRandomId } from "../hooks/useId";
import {
    ListboxGroupType,
    ListboxItemType,
    ListboxOptionType,
} from "../listbox";
import { ensureArray } from "../utils/array";
import { isFunction } from "../utils/function";
import { copy } from "../utils/object";

const DROPDOWN_ACTION_TYPE_NONE = 0;
const DROPDOWN_ACTION_TYPE_Close = 1;
const DROPDOWN_ACTION_TYPE_CloseSelect = 2;
const DROPDOWN_ACTION_TYPE_SelectFirst = 3;
const DROPDOWN_ACTION_TYPE_SelectLast = 4;
const DROPDOWN_ACTION_TYPE_SelectNext = 5;
const DROPDOWN_ACTION_TYPE_Open = 6;
const DROPDOWN_ACTION_TYPE_PageDown = 7;
const DROPDOWN_ACTION_TYPE_PageUp = 8;
const DROPDOWN_ACTION_TYPE_SelectPrevious = 9;
const DROPDOWN_ACTION_TYPE_Type = 10;
const DROPDOWN_ACTION_TYPE_UpdateItems = 11;
const DROPDOWN_ACTION_TYPE_Search = 12;

type DropdownState<T> = {
    expanded: boolean;
    listboxId: string;
    labelId: string;
    searchId: string;
    activeIndex: number;
    items: ListboxItemType<T>[];
    flatItems: ListboxOptionType<T>[];
    effect?: CallableFunction;
    event?: CallableFunction;
    focusSearch?: boolean;
    focusDropdown?: boolean;
    search: string;
};

type DropdownAction_Close = {
    type: typeof DROPDOWN_ACTION_TYPE_Close;
};

type DropdownAction_CloseSelect<T> = {
    type: typeof DROPDOWN_ACTION_TYPE_CloseSelect;
    onChange: undefined | ((value: T) => void);
};

type DropdownAction_SelectFirst = {
    type: typeof DROPDOWN_ACTION_TYPE_SelectFirst;
};

type DropdownAction_SelectLast = {
    type: typeof DROPDOWN_ACTION_TYPE_SelectLast;
};

type DropdownAction_SelectNext = {
    type: typeof DROPDOWN_ACTION_TYPE_SelectNext;
};

type DropdownAction_SelectPrevious = {
    type: typeof DROPDOWN_ACTION_TYPE_SelectPrevious;
};

type DropdownAction_Open<T> = {
    type: typeof DROPDOWN_ACTION_TYPE_Open;
    values: T[];
};

type DropdownAction_PageDown = {
    type: typeof DROPDOWN_ACTION_TYPE_PageDown;
};

type DropdownAction_PageUp = {
    type: typeof DROPDOWN_ACTION_TYPE_PageUp;
};

type DropdownAction_Type = {
    type: typeof DROPDOWN_ACTION_TYPE_Type;
};

type DropdownAction_UpdateItems<T> = {
    type: typeof DROPDOWN_ACTION_TYPE_UpdateItems;
    items: ListboxItemType<T>[];
};

type DropdownAction_Search = {
    type: typeof DROPDOWN_ACTION_TYPE_Search;
    search: string;
};

type DropdownAction_None = {
    type: typeof DROPDOWN_ACTION_TYPE_NONE;
};

type DropdownAction<T> =
    | DropdownAction_Close
    | DropdownAction_CloseSelect<T>
    | DropdownAction_SelectFirst
    | DropdownAction_SelectLast
    | DropdownAction_SelectNext
    | DropdownAction_SelectPrevious
    | DropdownAction_Open<T>
    | DropdownAction_PageDown
    | DropdownAction_PageUp
    | DropdownAction_Type
    | DropdownAction_UpdateItems<T>
    | DropdownAction_Search
    | DropdownAction_None;

// all keys that will do the default open action
const openKeys = ["ArrowDown", "ArrowUp", "Enter", " "];

function getActionFromKeyboardEvent<T>(
    event: React.KeyboardEvent,
    expanded: boolean,
    values: T[],
    onChange: ((value: T) => void) | undefined,
): DropdownAction<T> {
    const { key, altKey, ctrlKey, metaKey } = event;

    // handle opening when closed
    if (!expanded && openKeys.includes(key)) {
        event.preventDefault();
        return {
            type: DROPDOWN_ACTION_TYPE_Open,
            values,
        };
    }

    // home and end move the selected option when open or closed
    if (key === "Home") {
        event.preventDefault();
        return {
            type: DROPDOWN_ACTION_TYPE_SelectFirst,
        };
    }
    if (key === "End") {
        event.preventDefault();
        return {
            type: DROPDOWN_ACTION_TYPE_SelectLast,
        };
    }

    // handle typing characters when open or closed
    if (
        key === "Backspace" ||
        key === "Clear" ||
        (key.length === 1 && key !== " " && !altKey && !ctrlKey && !metaKey)
    ) {
        return {
            type: DROPDOWN_ACTION_TYPE_Type,
        };
    }

    // handle keys when open
    if (expanded) {
        if (key === "ArrowUp" && altKey) {
            event.preventDefault();
            return {
                type: DROPDOWN_ACTION_TYPE_CloseSelect,
                onChange,
            };
        } else if (key === "ArrowDown" && !altKey) {
            event.preventDefault();
            return {
                type: DROPDOWN_ACTION_TYPE_SelectNext,
            };
        } else if (key === "ArrowUp") {
            event.preventDefault();
            return {
                type: DROPDOWN_ACTION_TYPE_SelectPrevious,
            };
        } else if (key === "PageUp") {
            event.preventDefault();
            return {
                type: DROPDOWN_ACTION_TYPE_PageUp,
            };
        } else if (key === "PageDown") {
            event.preventDefault();
            return {
                type: DROPDOWN_ACTION_TYPE_PageDown,
            };
        } else if (key === "Escape") {
            event.preventDefault();
            return {
                type: DROPDOWN_ACTION_TYPE_Close,
            };
        } else if (key === "Enter" || key === " ") {
            event.preventDefault();
            return {
                type: DROPDOWN_ACTION_TYPE_CloseSelect,
                onChange,
            };
        }
    }

    return {
        type: DROPDOWN_ACTION_TYPE_NONE,
    };
}

function isGroupType<T>(
    subject: ListboxItemType<T>,
): subject is ListboxGroupType<T> {
    return Object.hasOwn(subject, "children");
}

function getFlatItems<T>(
    propItems: ListboxItemType<T>[],
    idPrefix = "",
) {
    let flatItems: ListboxOptionType<T>[] = [];
    const items = ensureArray(propItems).map((item): ListboxItemType<T> => {
        if (isGroupType(item)) {
            const id = item.id || createRandomId("group-");
            const { flatItems: _flatItems, items: _items } = getFlatItems(
                item.children,
                id + "-",
            );

            flatItems = flatItems.concat(_flatItems);

            return copy(item, {
                id,
                children: _items as ListboxOptionType<T>[],
            });
        }

        const option = copy(item, {
            id: item.id || createRandomId(idPrefix + "option-"),
        });

        flatItems.push(option);

        return option;
    });

    return { items, flatItems };
}

function getFirstSelectedIndex<T>(
    options: ListboxOptionType<T>[],
    values: T[],
) {
    for (let i = 0, length = options.length; i < length; i++) {
        const option = options[i];
        if (values.includes(option.value)) {
            return i;
        }
    }

    return 0;
}

function initDropdownState<T>(): DropdownState<T> {
    return {
        activeIndex: -1,
        expanded: false,
        flatItems: [],
        items: [],
        labelId: createRandomId("label-"),
        listboxId: createRandomId("listbox-"),
        searchId: createRandomId("search-"),
        search: "",
    };
}

const pageSize = 10;

function createScrollIntoViewEffect<T>(
    option: ListboxOptionType<T> | undefined,
) {
    const id = option?.id;
    if (id != null) {
        return () => {
            setTimeout(() => {
                const el = document.getElementById(id);
                if (el != null) {
                    el.scrollIntoView({
                        block: "center",
                        behavior: "smooth",
                    });
                }
            }, 500);
        };
    }
}

function dropdownStore<T>(
    state: DropdownState<T>,
    action: DropdownAction<T>,
): DropdownState<T> {
    switch (action.type) {
        case DROPDOWN_ACTION_TYPE_Close:
            return copy(state, {
                activeIndex: -1,
                expanded: false,
                focusDropdown: true,
                search: "",
            });

        case DROPDOWN_ACTION_TYPE_CloseSelect:
            return copy(state, {
                activeIndex: -1,
                expanded: false,
                focusDropdown: true,
                search: "",
                event: () => {
                    if (isFunction(action.onChange)) {
                        action.onChange(
                            state.flatItems[state.activeIndex].value,
                        );
                    }
                },
            });

        case DROPDOWN_ACTION_TYPE_Open: {
            const activeIndex = getFirstSelectedIndex(
                state.flatItems,
                action.values,
            );

            return copy(state, {
                activeIndex,
                expanded: true,
                focusSearch: true,
                effect: createScrollIntoViewEffect(
                    state.flatItems[activeIndex],
                ),
            });
        }

        case DROPDOWN_ACTION_TYPE_PageDown: {
            const activeIndex = Math.min(
                state.activeIndex,
                state.activeIndex + pageSize,
            );

            return copy(state, {
                activeIndex,
                effect: createScrollIntoViewEffect(
                    state.flatItems[activeIndex],
                ),
            });
        }

        case DROPDOWN_ACTION_TYPE_PageUp: {
            const activeIndex = Math.max(
                state.activeIndex,
                state.activeIndex - pageSize,
            );

            return copy(state, {
                activeIndex,
                effect: createScrollIntoViewEffect(
                    state.flatItems[activeIndex],
                ),
            });
        }

        case DROPDOWN_ACTION_TYPE_SelectFirst:
            return copy(state, {
                activeIndex: 0,
                effect: createScrollIntoViewEffect(
                    state.flatItems[0],
                ),
            });

        case DROPDOWN_ACTION_TYPE_SelectLast: {
            const activeIndex = state.flatItems.length - 1;

            return copy(state, {
                activeIndex,
                effect: createScrollIntoViewEffect(
                    state.flatItems[activeIndex],
                ),
            });
        }

        case DROPDOWN_ACTION_TYPE_SelectNext: {
            const activeIndex = Math.min(
                state.flatItems.length - 1,
                state.activeIndex + 1,
            );

            return copy(state, {
                activeIndex,
                effect: createScrollIntoViewEffect(
                    state.flatItems[activeIndex],
                ),
            });
        }

        case DROPDOWN_ACTION_TYPE_SelectPrevious: {
            const activeIndex = Math.max(0, state.activeIndex - 1);

            return copy(state, {
                activeIndex,
                effect: createScrollIntoViewEffect(
                    state.flatItems[activeIndex],
                ),
            });
        }

        case DROPDOWN_ACTION_TYPE_Type:
            return state; //@TODO

        case DROPDOWN_ACTION_TYPE_UpdateItems: {
            const { flatItems, items } = getFlatItems(action.items);
            return copy(state, {
                items,
                flatItems,
                activeIndex: 0,
            });
        }

        case DROPDOWN_ACTION_TYPE_Search:
            return copy(state, { search: action.search });
    }

    return state;
}

export {
    DROPDOWN_ACTION_TYPE_Close,
    DROPDOWN_ACTION_TYPE_CloseSelect,
    DROPDOWN_ACTION_TYPE_Open,
    DROPDOWN_ACTION_TYPE_Search,
    DROPDOWN_ACTION_TYPE_UpdateItems,
    dropdownStore,
    getActionFromKeyboardEvent,
    initDropdownState,
};

export type { DropdownAction, DropdownState };
