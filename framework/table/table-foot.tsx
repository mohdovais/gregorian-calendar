import { emptyFn, isFunction } from "../utils/function";
import { RenderSettings } from "./table.common";
import { TableHeadProps } from "./table-head";
import css from "./table.module.css";
import { JSX } from "react";

type TableFootProps<T, U> = Omit<TableHeadProps<T, U>, "sortable">;

function TableFoot<T, U>(props: TableFootProps<T, U>): JSX.Element {
    const { data, columns, metaData, onMessage } = props;

    const children = columns.map((column) => {
        const { summary } = column;
        const content = isFunction(summary)
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
            : summary;

        return (
            <td key={column.id} className={css.tfoot_td}>
                <span className={css.tfoot_cell}>{content}</span>
            </td>
        );
    });

    return (
        <tfoot className={css.tfoot}>
            <tr className={css.tfoot_tr}>{children}</tr>
        </tfoot>
    );
}

export { TableFoot };
export type { TableFootProps };
