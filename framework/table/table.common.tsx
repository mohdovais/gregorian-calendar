import css from "./table.module.css";

function getAlignClassName(align: TableColumnBase<unknown, unknown>["align"]) {
    return align === "left"
        ? css.left
        : align === "right"
        ? css.right
        : css.center;
}

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

type RenderSettings<T, U> = {
    data: T[];
    metaData?: U;
    columns: TableColumn<T, U>[];
    sendMessage: (message: string) => void;
};

type HeaderRenderer<T, U> = (
    column: TableColumn<T, U>,
    settings: Expand<RenderSettings<T, U>>,
) => React.ReactNode;

type CellRenderer<T, U> = (
    record: T,
    column: TableColumn<T, U>,
    settings: Expand<RenderSettings<T, U>>,
) => React.ReactNode;

interface TableColumnBase<T, U> {
    id: string | number;
    className?: string;
    align?: "left" | "center" | "right";
    header?: React.ReactNode | HeaderRenderer<T, U>;
    width?: number;
    hidden?: boolean;
    th?: boolean;
    summary?: React.ReactNode | HeaderRenderer<T, U>;
    columns?: TableColumn<T, U>[];
    sortable?: boolean;
    sorter?: {
        dir: "ASC" | "DSC";
        fn: (a: T, b: T) => 0 | 1 | -1;
    };
}

interface TableColumnWithDataIndex<T, U> extends TableColumnBase<T, U> {
    dataIndex: keyof T;
    renderer?: never;
}

interface TableColumnWithRenderer<T, U> extends TableColumnBase<T, U> {
    dataIndex?: never;
    renderer: CellRenderer<T, U>;
}

type TableColumn<T, U = unknown> =
    | TableColumnWithDataIndex<T, U>
    | TableColumnWithRenderer<T, U>;

export { getAlignClassName };

export type {
    CellRenderer,
    Expand,
    RenderSettings,
    TableColumn,
    TableColumnWithDataIndex,
    TableColumnWithRenderer,
};
