import { createRandomId } from "../hooks/useId";
import {
    ListboxGroupType,
    ListboxItemType,
    ListboxOptionType,
} from "../listbox";
import { ensureArray } from "../utils/array";
import { isFunction } from "../utils/function";
import { copy } from "../utils/object";
import {
    KEYBOARD_ACTION_TYPE_Close,
    KEYBOARD_ACTION_TYPE_CloseSelect,
    KEYBOARD_ACTION_TYPE_Open,
    KEYBOARD_ACTION_TYPE_PageDown,
    KEYBOARD_ACTION_TYPE_PageUp,
    KEYBOARD_ACTION_TYPE_SelectFirst,
    KEYBOARD_ACTION_TYPE_SelectLast,
    KEYBOARD_ACTION_TYPE_SelectNext,
    KEYBOARD_ACTION_TYPE_SelectPrevious,
    KEYBOARD_ACTION_TYPE_Type,
    KeyboardAction,
} from "./dropdown.utils";

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

type DropdownAction_UpdateItems<T> = {
    type: typeof DROPDOWN_ACTION_TYPE_UpdateItems;
    items: ListboxItemType<T>[];
};

type DropdownAction_Search = {
    type: typeof DROPDOWN_ACTION_TYPE_Search;
    search: string;
};

type DropdownAction<T> =
    | KeyboardAction<T>
    | DropdownAction_UpdateItems<T>
    | DropdownAction_Search;

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
        case KEYBOARD_ACTION_TYPE_Close:
            return copy(state, {
                activeIndex: -1,
                expanded: false,
                focusDropdown: true,
                search: "",
            });

        case KEYBOARD_ACTION_TYPE_CloseSelect:
            return copy(state, {
                activeIndex: -1,
                expanded: false,
                focusDropdown: true,
                search: "",
                event: () => {
                    if (isFunction(action.onChange)) {
                        action.onChange(
                            state.flatItems[state.activeIndex]?.value,
                        );
                    }
                },
            });

        case KEYBOARD_ACTION_TYPE_Open: {
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

        case KEYBOARD_ACTION_TYPE_PageDown: {
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

        case KEYBOARD_ACTION_TYPE_PageUp: {
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

        case KEYBOARD_ACTION_TYPE_SelectFirst:
            return copy(state, {
                activeIndex: 0,
                effect: createScrollIntoViewEffect(
                    state.flatItems[0],
                ),
            });

        case KEYBOARD_ACTION_TYPE_SelectLast: {
            const activeIndex = state.flatItems.length - 1;

            return copy(state, {
                activeIndex,
                effect: createScrollIntoViewEffect(
                    state.flatItems[activeIndex],
                ),
            });
        }

        case KEYBOARD_ACTION_TYPE_SelectNext: {
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

        case KEYBOARD_ACTION_TYPE_SelectPrevious: {
            const activeIndex = Math.max(0, state.activeIndex - 1);

            return copy(state, {
                activeIndex,
                effect: createScrollIntoViewEffect(
                    state.flatItems[activeIndex],
                ),
            });
        }

        case KEYBOARD_ACTION_TYPE_Type:
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
    DROPDOWN_ACTION_TYPE_Search,
    DROPDOWN_ACTION_TYPE_UpdateItems,
    dropdownStore,
    initDropdownState,
};

export type { DropdownAction, DropdownState };
