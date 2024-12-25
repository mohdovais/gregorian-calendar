import { ensureArray } from "../utils/array";
import { emptyFn, isFunction } from "../utils/function";
import { classNames } from "../utils/string";
import css from "./table.module.css";

function getAlignClassName(align: TableColumnBase<unknown>["align"]) {
    return align === "left"
        ? css.left
        : align === "right"
        ? css.right
        : css.center;
}

type RenderMetaData<T> = {
    data: T[];
    columns: TableColumn<T>[];
    sendMessage: (message: string) => void;
};

type HeaderRenderer<T> = (
    column: TableColumn<T>,
    meta: RenderMetaData<T>,
) => React.ReactNode;

type CellRenderer<T> = (
    record: T,
    column: TableColumn<T>,
    meta: RenderMetaData<T>,
) => React.ReactNode;

interface TableColumnBase<T> {
    id: string | number;
    className?: string;
    align?: "left" | "center" | "right";
    header?: React.ReactNode | HeaderRenderer<T>;
    width?: number;
    editable?: boolean;
    editor?: React.ReactElement;
    hidden?: boolean;
    th?: boolean;
    summary?: React.ReactNode | HeaderRenderer<T>;
    columns?: TableColumn<T>[];
    sortable?: boolean;
}

interface TableColumnDataIndex<T> extends TableColumnBase<T> {
    dataIndex: keyof T;
    renderer?: never;
}

interface TableColumnRenderer<T> extends TableColumnBase<T> {
    dataIndex?: never;
    renderer: CellRenderer<T>;
}

type TableColumn<T> = TableColumnDataIndex<T> | TableColumnRenderer<T>;

interface TableProps<T> extends
    React.DetailedHTMLProps<
        React.TableHTMLAttributes<HTMLTableElement>,
        HTMLTableElement
    > {
    data: T[];
    columns: TableColumn<T>[];
    rowClassName?: TableBodyProps<T>["rowClassName"];
    rowKey: TableBodyProps<T>["rowId"];
    hideHeaders?: boolean;
    sortable?: boolean;
    onCellMessage?: TableBodyProps<T>["onMessage"];
    onHeaderMessage?: TableHeaderProps<T>["onMessage"];
}

function Table<T>(props: TableProps<T>) {
    const {
        className,
        data,
        columns,
        rowKey,
        rowClassName,
        hideHeaders = false,
        sortable = false,
        onCellMessage,
        onHeaderMessage,
        ...tableProps
    } = props;

    const _columns = ensureArray(columns);
    const _data = ensureArray(data);
    const hasSummary = _columns.some((column) => column.summary != null);

    return (
        <table className={classNames(css.table, className)} {...tableProps}>
            {hideHeaders ? null : (
                <TableHeader
                    data={_data}
                    columns={_columns}
                    sortable={sortable}
                    onMessage={onHeaderMessage}
                />
            )}
            <TableBody
                columns={_columns}
                data={_data}
                rowId={rowKey}
                rowClassName={rowClassName}
                onMessage={onCellMessage}
            />
            {hasSummary
                ? <TableFooter columns={_columns} data={_data} />
                : null}
        </table>
    );
}

type TableHeaderProps<T> = {
    data: T[];
    columns: TableColumn<T>[];
    onMessage?: (message: string, column: TableColumn<T>) => void;
    sortable: boolean;
};

function TableHeader<T>(props: TableHeaderProps<T>) {
    const { columns, data, sortable, onMessage } = props;

    return (
        <thead>
            <tr>
                {columns.map((column) => {
                    const { id, align = "left", header } = column;
                    const thClassName = classNames(
                        css.th,
                        getAlignClassName(align),
                    );

                    const content = isFunction(header)
                        ? header(column, {
                            columns,
                            data,
                            sendMessage: isFunction(onMessage)
                                ? (message: string) =>
                                    onMessage(message, column)
                                : emptyFn as RenderMetaData<T>[
                                    "sendMessage"
                                ],
                        })
                        : header;

                    return (
                        <th key={id} className={thClassName} scope="col">
                            {content}
                        </th>
                    );
                })}
            </tr>
        </thead>
    );
}

function hasRenderer<T>(
    column: TableColumn<T>,
): column is TableColumnRenderer<T> {
    return isFunction(column.renderer);
}

type TableBodyProps<T> = {
    columns: TableColumn<T>[];
    data: T[];
    rowClassName?:
        | string
        | ((record: T) => string | undefined | null);
    rowId: keyof T | ((record: T) => string | number);
    onMessage?: TableDataProps<T>["onMessage"];
};

function TableBody<T>(props: TableBodyProps<T>) {
    const { columns, data, rowClassName, rowId, onMessage } = props;
    return (
        <tbody>
            {data.map((record) => {
                const rowKey = isFunction(rowId)
                    ? rowId(record)
                    : String(record[rowId]);

                const trClassName = classNames(
                    css.tr,
                    isFunction(rowClassName)
                        ? rowClassName(record)
                        : rowClassName,
                );

                const tds = columns.map((column) => (
                    <TableData
                        key={column.id}
                        data={data}
                        columns={columns}
                        column={column}
                        record={record}
                        onMessage={onMessage}
                    />
                ));

                return <tr key={rowKey} className={trClassName}>{tds}</tr>;
            })}
        </tbody>
    );
}

type TableDataProps<T> = {
    data: T[];
    columns: TableColumn<T>[];
    record: T;
    column: TableColumn<T>;
    onMessage?: (
        message: string,
        record: T,
        column: TableColumn<T>,
    ) => void;
};

function TableData<T>(props: TableDataProps<T>) {
    const { data, columns, column, record, onMessage } = props;
    const {
        align = "left",
        className,
        editable = false,
        editor,
        hidden = false,
        width,
        th = false,
    } = column;

    if (hidden) {
        return null;
    }

    const tdClassName = classNames(
        css.td,
        getAlignClassName(align),
        className,
    );

    const content = hasRenderer(column)
        ? column.renderer(record, column, {
            columns,
            data,
            sendMessage: isFunction(onMessage)
                ? (message: string) => {
                    onMessage(message, record, column);
                }
                : emptyFn as RenderMetaData<T>["sendMessage"],
        })
        : String(record[column.dataIndex]);

    return th
        ? (
            <th className={tdClassName} scope="row">
                {content}
            </th>
        )
        : (
            <td className={tdClassName} width={width}>
                {content}
            </td>
        );
}

type TableFooterProps<T> = Omit<TableHeaderProps<T>, "sortable">;

function TableFooter<T>(props: TableFooterProps<T>) {
    const { data, columns, onMessage } = props;

    const content = columns.map((column) => {
        const { summary } = column;
        return (
            <td>
                {isFunction(summary)
                    ? summary(column, {
                        data,
                        columns,
                        sendMessage: isFunction(onMessage)
                            ? (message: string) => {
                                onMessage(message, column);
                            }
                            : emptyFn as RenderMetaData<T>["sendMessage"],
                    })
                    : summary}
            </td>
        );
    });

    return (
        <tfoot>
            <tr>{content}</tr>
        </tfoot>
    );
}

export { Table };
export type { TableColumn, TableProps };
