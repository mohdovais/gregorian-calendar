import { JSX } from "react";
import { TableColumn } from ".";
import { emptyFn, isFunction } from "../utils/function";
import { classNames } from "../utils/string";
import {
    getAlignClassName,
    RenderSettings,
    TableColumnWithRenderer,
} from "./table.common";
import css from "./table.module.css";

function hasRenderer<T, U>(
    column: TableColumn<T, U>,
): column is TableColumnWithRenderer<T, U> {
    return isFunction(column.renderer);
}

type TableBodyProps<T, U> = {
    columns: TableColumn<T, U>[];
    data: T[];
    metaData?: U;
    rowClassName?:
        | string
        | ((record: T) => string | undefined | null);
    rowId: keyof T | ((record: T) => string | number);
    onMessage?: TableDataProps<T, U>["onMessage"];
    onCellClick?: TableDataProps<T, U>["onClick"];
    onCellRightClick?: TableDataProps<T, U>["onRightClick"];
    onCellDoubleClick?: TableDataProps<T, U>["onDoubleClick"];
};

function TableBody<T, U>(props: TableBodyProps<T, U>): JSX.Element {
    const {
        columns,
        data,
        metaData,
        rowClassName,
        rowId,
        onMessage,
        onCellClick,
        onCellRightClick,
        onCellDoubleClick,
    } = props;

    const children = data.map((record) => {
        const rowKey = isFunction(rowId)
            ? rowId(record)
            : String(record[rowId]);

        const trClassName = classNames(
            css.body_tr,
            isFunction(rowClassName) ? rowClassName(record) : rowClassName,
        );

        const tds = columns.map((column) => (
            <TableData
                key={column.id}
                data={data}
                metaData={metaData}
                columns={columns}
                column={column}
                record={record}
                onMessage={onMessage}
                onClick={onCellClick}
                onRightClick={onCellRightClick}
                onDoubleClick={onCellDoubleClick}
            />
        ));

        return <tr key={rowKey} className={trClassName}>{tds}</tr>;
    });

    return <tbody>{children}</tbody>;
}

type TableDataProps<T, U> = {
    data: T[];
    metaData?: U;
    columns: TableColumn<T, U>[];
    record: T;
    column: TableColumn<T, U>;
    onMessage?: (
        message: string,
        record: T,
        column: TableColumn<T, U>,
    ) => void;
    onClick?: (
        event: React.MouseEvent<HTMLTableCellElement, MouseEvent>,
        record: T,
        column: TableColumn<T, U>,
    ) => void;
    onRightClick?: (
        event: React.MouseEvent<HTMLTableCellElement, MouseEvent>,
        record: T,
        column: TableColumn<T, U>,
    ) => void;
    onDoubleClick?: (
        event: React.MouseEvent<HTMLTableCellElement, MouseEvent>,
        record: T,
        column: TableColumn<T, U>,
    ) => void;
};

function TableData<T, U>(props: TableDataProps<T, U>): JSX.Element {
    const {
        data,
        columns,
        column,
        metaData,
        record,
        onMessage,
        onClick,
        onRightClick,
        onDoubleClick,
    } = props;

    const {
        align = "left",
        className,
        hidden = false,
        th = false,
    } = column;

    if (hidden) {
        return null;
    }

    const tdClassName = classNames(
        css.tbody_td,
        getAlignClassName(align),
        className,
    );

    const content = hasRenderer(column)
        ? column.renderer(record, column, {
            columns,
            data,
            metaData,
            sendMessage: isFunction(onMessage)
                ? (message: string) => {
                    onMessage(message, record, column);
                }
                : emptyFn as RenderSettings<T, U>["sendMessage"],
        })
        : String(record[column.dataIndex]);

    const clickHandler = isFunction(onClick)
        ? (event: React.MouseEvent<HTMLTableCellElement>) => {
            onClick(event, record, column);
        }
        : undefined;

    const doubleClickHandler = isFunction(onDoubleClick)
        ? (event: React.MouseEvent<HTMLTableCellElement>) => {
            onDoubleClick(event, record, column);
        }
        : undefined;

    const rightClickHandler = isFunction(onRightClick)
        ? (event: React.MouseEvent<HTMLTableCellElement>) => {
            onRightClick(event, record, column);
        }
        : undefined;

    return th
        ? (
            <th
                className={tdClassName}
                scope="row"
                onClick={clickHandler}
                onDoubleClick={doubleClickHandler}
                onContextMenu={rightClickHandler}
            >
                {content}
            </th>
        )
        : (
            <td
                className={tdClassName}
                onClick={clickHandler}
                onDoubleClick={doubleClickHandler}
                onContextMenu={rightClickHandler}
            >
                {content}
            </td>
        );
}

export { TableBody };
export type { TableBodyProps };
