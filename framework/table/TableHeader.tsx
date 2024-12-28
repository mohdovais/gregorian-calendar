import { TableColumn } from ".";
import { SortIcon } from "./sort-icon";
import { ensureArray } from "../utils/array";
import { emptyFn, isFunction } from "../utils/function";
import { classNames } from "../utils/string";
import { getAlignClassName, RenderSettings } from "./table.common";

import css from "./table.module.css";

type SortInfo<T, U> = {
    columnId: TableColumn<T, U>["id"];
    direction: "ASC" | "DSC";
};

type TableHeaderProps<T, U> = {
    data: T[];
    metaData?: U;
    columns: TableColumn<T, U>[];
    sortable?: boolean;
    sortInfo?: SortInfo<T, U> | SortInfo<T, U>[];
    onMessage?: (message: string, column: TableColumn<T, U>) => void;
    onClick?: (
        event: React.MouseEvent<HTMLTableCellElement>,
        column: TableColumn<T, U>,
    ) => void;
};

function TableHeader<T, U>(props: TableHeaderProps<T, U>) {
    const { columns, data, metaData, sortable, onMessage, onClick } = props;
    const sortInfo = ensureArray(props.sortInfo);
    const children = columns.map((column) => {
        const {
            id,
            align = "left",
            header,
            hidden = false,
        } = column;

        if (hidden) {
            return null;
        }

        const isSortable = sortable === false || column.sortable === false
            ? false
            : sortable === true || column.sortable === true;

        const sortDirection = isSortable
            ? sortInfo.find((info) => info.columnId === id)
                ?.direction
            : undefined;

        const thClassName = classNames(
            css.th,
            getAlignClassName(align),
            isSortable && css.sortable,
        );

        const content = isFunction(header)
            ? header(column, {
                columns,
                data,
                metaData,
                sendMessage: isFunction(onMessage)
                    ? (message: string) => onMessage(message, column)
                    : emptyFn as RenderSettings<T, U>[
                        "sendMessage"
                    ],
            })
            : header;

        const hasOnClick = isFunction(onClick);

        const clickHandler = hasOnClick
            ? (event: React.MouseEvent<HTMLTableCellElement>) => {
                onClick(event, column);
            }
            : undefined;

        return (
            <th
                key={id}
                className={thClassName}
                scope="col"
                tabIndex={isSortable || hasOnClick ? 0 : undefined}
                onClick={clickHandler}
            >
                <span>
                    <span>{content}</span>
                    {isSortable
                        ? (
                            <SortIcon
                                dir={sortDirection}
                                className={css.sort_icon}
                            />
                        )
                        : null}
                </span>
            </th>
        );
    });

    return (
        <thead>
            <tr>{children}</tr>
        </thead>
    );
}

export { TableHeader };
export type { SortInfo, TableHeaderProps };
