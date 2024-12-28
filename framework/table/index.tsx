import { ensureArray } from "../utils/array";
import { classNames } from "../utils/string";
import { TableBody, TableBodyProps } from "./TableBody";
import { TableFooter } from "./TableFooter";
import { SortInfo, TableHeader, TableHeaderProps } from "./TableHeader";
import { TableColumn } from "./table.common";

import css from "./table.module.css";

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

type ExpandedSortInfo<T, U> = Expand<SortInfo<T, U>>;

interface TableProps<T, U> extends
    React.DetailedHTMLProps<
        React.TableHTMLAttributes<HTMLTableElement>,
        HTMLTableElement
    > {
    data: T[];
    metaData?: U;
    columns: Expand<TableColumn<T, U>>[];
    rowClassName?: TableBodyProps<T, U>["rowClassName"];
    rowKey: TableBodyProps<T, U>["rowId"];
    hideHeaders?: boolean;
    sortable?: boolean;
    sortInfo?: TableHeaderProps<T, U>["sortInfo"];
    onHeaderMessage?: TableHeaderProps<T, U>["onMessage"];
    onHeaderClick?: TableHeaderProps<T, U>["onClick"];
    onCellMessage?: TableBodyProps<T, U>["onMessage"];
    onCellClick?: TableBodyProps<T, U>["onCellClick"];
    onCellRightClick?: TableBodyProps<T, U>["onCellRightClick"];
    onCellDoubleClick?: TableBodyProps<T, U>["onCellDoubleClick"];
}

function Table<DataType, MetaDataType>(
    props: Expand<TableProps<DataType, MetaDataType>>,
) {
    const {
        className,
        data,
        metaData,
        columns,
        rowKey,
        rowClassName,
        hideHeaders = false,
        sortable,
        sortInfo,
        onCellMessage,
        onHeaderMessage,
        onHeaderClick,
        onCellClick,
        onCellRightClick,
        onCellDoubleClick,
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
                    sortInfo={sortInfo}
                    onMessage={onHeaderMessage}
                    onClick={onHeaderClick}
                />
            )}
            <TableBody
                columns={_columns}
                metaData={metaData}
                data={_data}
                rowId={rowKey}
                rowClassName={rowClassName}
                onMessage={onCellMessage}
                onCellClick={onCellClick}
                onCellRightClick={onCellRightClick}
                onCellDoubleClick={onCellDoubleClick}
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

export { Table };
export type { ExpandedSortInfo as SortInfo, TableColumn, TableProps };
