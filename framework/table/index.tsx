import { ensureArray } from "../utils/array";
import { emptyFn, isFunction } from "../utils/function";
import { classNames } from "../utils/string";
import css from "./table.module.css";

function getAlignClassName(align: TableColumnBase<unknown, unknown>["align"]) {
    return align === "left"
        ? css.left
        : align === "right"
        ? css.right
        : css.center;
}

type RenderSettings<T, U> = {
    data: T[];
    metaData?: U;
    columns: TableColumn<T, U>[];
    sendMessage: (message: string) => void;
};

type HeaderRenderer<T, U> = (
    column: TableColumn<T, U>,
    settings: RenderSettings<T, U>,
) => React.ReactNode;

type CellRenderer<T, U> = (
    record: T,
    column: TableColumn<T, U>,
    settings: RenderSettings<T, U>,
) => React.ReactNode;

interface TableColumnBase<T, U> {
    id: string | number;
    className?: string;
    align?: "left" | "center" | "right";
    header?: React.ReactNode | HeaderRenderer<T, U>;
    width?: number;
    editable?: boolean;
    editor?: React.ReactElement;
    hidden?: boolean;
    th?: boolean;
    summary?: React.ReactNode | HeaderRenderer<T, U>;
    columns?: TableColumn<T, U>[];
    sortable?: boolean;
}

interface TableColumnDataIndex<T, U> extends TableColumnBase<T, U> {
    dataIndex: keyof T;
    renderer?: never;
}

interface TableColumnRenderer<T, U> extends TableColumnBase<T, U> {
    dataIndex?: never;
    renderer: CellRenderer<T, U>;
}

type TableColumn<T, U = unknown> =
    | TableColumnDataIndex<T, U>
    | TableColumnRenderer<T, U>;

interface TableProps<T, U> extends
    React.DetailedHTMLProps<
        React.TableHTMLAttributes<HTMLTableElement>,
        HTMLTableElement
    > {
    data: T[];
    metaData?: U;
    columns: TableColumn<T, U>[];
    rowClassName?: TableBodyProps<T, U>["rowClassName"];
    rowKey: TableBodyProps<T, U>["rowId"];
    hideHeaders?: boolean;
    sortable?: boolean;
    onCellMessage?: TableBodyProps<T, U>["onMessage"];
    onHeaderMessage?: TableHeaderProps<T, U>["onMessage"];
}

function Table<T, U>(props: TableProps<T, U>) {
    const {
        className,
        data,
        metaData,
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
                    metaData={metaData}
                    columns={_columns}
                    sortable={sortable}
                    onMessage={onHeaderMessage}
                />
            )}
            <TableBody
                columns={_columns}
                metaData={metaData}
                data={_data}
                rowId={rowKey}
                rowClassName={rowClassName}
                onMessage={onCellMessage}
            />
            {hasSummary
                ? (
                    <TableFooter
                        columns={_columns}
                        data={_data}
                        metaData={metaData}
                    />
                )
                : null}
        </table>
    );
}

type TableHeaderProps<T, U> = {
    data: T[];
    metaData?: U;
    columns: TableColumn<T, U>[];
    onMessage?: (message: string, column: TableColumn<T, U>) => void;
    sortable: boolean;
};

function TableHeader<T, U>(props: TableHeaderProps<T, U>) {
    const { columns, data, metaData, sortable, onMessage } = props;

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
                            metaData,
                            sendMessage: isFunction(onMessage)
                                ? (message: string) =>
                                    onMessage(message, column)
                                : emptyFn as RenderSettings<T, U>[
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

function hasRenderer<T, U>(
    column: TableColumn<T, U>,
): column is TableColumnRenderer<T, U> {
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
};

function TableBody<T, U>(props: TableBodyProps<T, U>) {
    const { columns, data, metaData, rowClassName, rowId, onMessage } = props;
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
                        metaData={metaData}
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
};

function TableData<T, U>(props: TableDataProps<T, U>) {
    const { data, columns, column, metaData, record, onMessage } = props;
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
            metaData,
            sendMessage: isFunction(onMessage)
                ? (message: string) => {
                    onMessage(message, record, column);
                }
                : emptyFn as RenderSettings<T, U>["sendMessage"],
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

type TableFooterProps<T, U> = Omit<TableHeaderProps<T, U>, "sortable">;

function TableFooter<T, U>(props: TableFooterProps<T, U>) {
    const { data, columns, metaData, onMessage } = props;

    const content = columns.map((column) => {
        const { summary } = column;
        return (
            <td>
                {isFunction(summary)
                    ? summary(column, {
                        data,
                        columns,
                        metaData,
                        sendMessage: isFunction(onMessage)
                            ? (message: string) => {
                                onMessage(message, column);
                            }
                            : emptyFn as RenderSettings<T, U>["sendMessage"],
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
