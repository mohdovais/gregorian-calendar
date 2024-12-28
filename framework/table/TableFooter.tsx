import { emptyFn, isFunction } from "../utils/function";
import { RenderSettings } from "./table.common";
import { TableHeaderProps } from "./TableHeader";

type TableFooterProps<T, U> = Omit<TableHeaderProps<T, U>, "sortable">;

function TableFooter<T, U>(props: TableFooterProps<T, U>) {
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

        return <td>{content}</td>;
    });

    return (
        <tfoot>
            <tr>{children}</tr>
        </tfoot>
    );
}

export { TableFooter };
export type { TableFooterProps };
