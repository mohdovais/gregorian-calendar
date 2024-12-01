type ColumnCommon<T> = {
	id: string | number;
	header: string | number | JSX.Element | ((data: T[]) => string | JSX.Element);
	summary?: JSX.Element | ((column: Column<T>) => JSX.Element);
};

type ColumnDataIndex<T> = ColumnCommon<T> & {
	dataIndex: keyof T;
	renderer?: never;
};

type ColumnRenderer<T> = ColumnCommon<T> & {
	dataIndex?: never;
	renderer: (record: T, column: Column<T>) => string | number | JSX.Element;
};

type Column<T> = ColumnDataIndex<T> | ColumnRenderer<T>;

type TBodyProps<T> = {
	data: T[];
	columns: Column<T>[];
};

type THeadProps<T> = {
	data: T[];
	columns: Column<T>[];
};

type TFootProps<T> = {
	columns: Column<T>[];
};

type TableProps<T> = TBodyProps<T> & {
	id?: string;
	className?: string;
};

function THead<T>(props: THeadProps<T>) {
	return (
		<thead>
			<tr>
				{props.columns.map((col) => (
					<th>
						{typeof col.header === "function"
							? col.header(props.data)
							: col.header}
					</th>
				))}
			</tr>
		</thead>
	);
}

function TBody<T>(props: TBodyProps<T>) {
	return (
		<tbody>
			{props.data.map((record) => (
				<tr>
					{props.columns.map((col) => (
						<td key={col.id}>
							{typeof col.renderer === "function"
								? col.renderer(record, col)
								: String(record[col.dataIndex])}
						</td>
					))}
				</tr>
			))}
		</tbody>
	);
}

function TFoot<T>(props: TFootProps<T>) {
	return (
		<tfoot>
			<tr>
				{props.columns.map((col) => (
					<td key={col.id}>
						{typeof col.summary === "function" ? col.summary(col) : col.summary}
					</td>
				))}
			</tr>
		</tfoot>
	);
}

function Table<T>(props: TableProps<T>) {
	const { className, id, columns, data } = props;
	return (
		<table id={id} className={className}>
			<THead columns={columns} data={data} />
			<TBody columns={columns} data={data} />
			<TFoot columns={columns} />
		</table>
	);
}

export { Table };
export type { Column };
