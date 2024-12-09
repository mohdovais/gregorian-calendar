import { createRandomId } from "../hooks/useId";
import {
    ListboxGroupType,
    ListboxItemType,
    ListboxOptionType,
} from "../listbox2";
import { ensureArray } from "../utils/array";
import { copy } from "../utils/object";

function isGroupType<T>(
    subject: ListboxItemType<T>,
): subject is ListboxGroupType<T> {
    return Object.hasOwn(subject, "children");
}

type ListOptions<T> = ListboxOptionType<T>[];

function ensureItemsWithId<T>(
    propItems: ListboxItemType<T>[],
    idPrefix = "",
) {
    let flatItems: ListOptions<T> = [];
    const items = ensureArray(propItems).map((item): ListboxItemType<T> => {
        if (isGroupType(item)) {
            const id = item.id || createRandomId("group-");
            const { flatItems: _flatItems, items: _items } = ensureItemsWithId(
                item.children,
                id + "-",
            );

            flatItems = flatItems.concat(_flatItems);

            return copy(item, {
                id,
                children: _items as ListOptions<T>,
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

function getFirstSelectedIndex<T>(options: ListOptions<T>, values: T[]) {
    for (let i = 0, length = options.length; i < length; i++) {
        const option = options[i];
        if (values.includes(option.value)) {
            return i;
        }
    }

    return -1;
}

function scrollSelectedIntoView(root: HTMLDivElement | null) {
    if (root == null) {
        return;
    }

    const selected = root.querySelector(
        "[aria-selected=true]",
    );

    if (selected != null) {
        setTimeout(
            () =>
                selected.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                }),
            500,
        );
    }
}

const SelectActions = {
    Close: 0,
    CloseSelect: 1,
    First: 2,
    Last: 3,
    Next: 4,
    Open: 5,
    PageDown: 6,
    PageUp: 7,
    Previous: 8,
    Select: 9,
    Type: 10,
};

const SelectAction_Close = 0,
    SelectAction_CloseSelect = 1,
    SelectAction_First = 2,
    SelectAction_Last = 3,
    SelectAction_Next = 4,
    SelectAction_Open = 5,
    SelectAction_PageDown = 6,
    SelectAction_PageUp = 7,
    SelectAction_Previous = 8,
    SelectAction_Select = 9,
    SelectAction_Type = 10;

type SelectActions =
    | typeof SelectAction_Close
    | typeof SelectAction_CloseSelect
    | typeof SelectAction_First
    | typeof SelectAction_Last
    | typeof SelectAction_Next
    | typeof SelectAction_Open
    | typeof SelectAction_PageDown
    | typeof SelectAction_PageUp
    | typeof SelectAction_Previous
    | typeof SelectAction_Select
    | typeof SelectAction_Type;

const openKeys = ["ArrowDown", "ArrowUp", "Enter", " "]; // all keys that will do the default open action

// map a key press to an action
function getActionFromKey(event: React.KeyboardEvent, expanded: boolean) {
    const { key, altKey, ctrlKey, metaKey } = event;

    // handle opening when closed
    if (!expanded && openKeys.includes(key)) {
        return SelectAction_Open;
    }

    // home and end move the selected option when open or closed
    if (key === "Home") {
        return SelectAction_First;
    }
    if (key === "End") {
        return SelectAction_Last;
    }

    // handle typing characters when open or closed
    if (
        key === "Backspace" ||
        key === "Clear" ||
        (key.length === 1 && key !== " " && !altKey && !ctrlKey && !metaKey)
    ) {
        return SelectAction_Type;
    }

    // handle keys when open
    if (expanded) {
        if (key === "ArrowUp" && altKey) {
            return SelectAction_CloseSelect;
        } else if (key === "ArrowDown" && !altKey) {
            return SelectAction_Next;
        } else if (key === "ArrowUp") {
            return SelectAction_Previous;
        } else if (key === "PageUp") {
            return SelectAction_PageUp;
        } else if (key === "PageDown") {
            return SelectAction_PageDown;
        } else if (key === "Escape") {
            return SelectAction_Close;
        } else if (key === "Enter" || key === " ") {
            return SelectAction_CloseSelect;
        }
    }
}

function getUpdatedIndex(
    currentIndex: number,
    maxIndex: number,
    action: SelectActions,
) {
    const pageSize = 10; // used for pageup/pagedown

    switch (action) {
        case SelectAction_First:
            return 0;
        case SelectAction_Last:
            return maxIndex;
        case SelectAction_Previous:
            return Math.max(0, currentIndex - 1);
        case SelectAction_Next:
            return Math.min(maxIndex, currentIndex + 1);
        case SelectAction_PageUp:
            return Math.max(0, currentIndex - pageSize);
        case SelectAction_PageDown:
            return Math.min(maxIndex, currentIndex + pageSize);
        default:
            return currentIndex;
    }
}

export {
    ensureItemsWithId,
    getActionFromKey,
    getFirstSelectedIndex,
    getUpdatedIndex,
    scrollSelectedIntoView,
    SelectAction_Close,
    SelectAction_CloseSelect,
    SelectAction_First,
    SelectAction_Last,
    SelectAction_Next,
    SelectAction_Open,
    SelectAction_PageDown,
    SelectAction_PageUp,
    SelectAction_Previous,
    SelectAction_Select,
    SelectAction_Type,
};

export type { SelectActions };
