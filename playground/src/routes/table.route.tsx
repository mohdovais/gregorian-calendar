import { startTransition, useMemo, useState } from "react";
import { createRoute, useLoaderData } from "@tanstack/react-router";
import { SortInfo, Table, TableColumn } from "framework/table";
import { Button } from "framework/button";
import { Checkbox } from "framework/checkbox";
import { classNames } from "framework/utils/string";

import css from "./table.module.css";
import { ScrollableTable } from "framework/scrollable-table";
import { indexRoute } from "./index.route";

type User = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    gender: string;
};

const columns: TableColumn<User, Record<number, boolean>>[] = [{
    id: "select",
    width: 1,
    header: (_, settings) => {
        const count = Object.keys(settings.metaData || {}).length;
        const checked = count > 0;
        const intermediate = checked && count !== settings.data.length;
        return (
            <Checkbox
                key={count}
                name="select-all"
                type="checkbox"
                title="Select all"
                defaultChecked={checked}
                intermediate={intermediate}
                small
            />
        );
    },
    renderer: (record, _, settings) => {
        const count = Object.keys(settings.metaData || {}).length;
        return (
            <Checkbox
                key={count}
                name="row-selection"
                value={record.id.toString()}
                title="Select row"
                defaultChecked={settings.metaData?.[record.id]}
                small
            />
        );
    },
    sortable: false,
}, {
    id: "first_name",
    header: "First Name",
    dataIndex: "first_name",
}, {
    id: "last_name",
    header: "Last Name",
    dataIndex: "last_name",
}, {
    id: "name",
    header: "Name",
    sortable: false,
    renderer: (record) => `${record.first_name} ${record.last_name}`,
}, {
    id: "email",
    header: "Email",
    renderer: (record) => <a href={`mailto:${record.email}`}>{record.email}</a>,
}, {
    id: "gender",
    header: "Gender",
    dataIndex: "gender",
    summary: (_, { data }) => {
        return data.filter((x) => x.gender === "Male").length + " males";
    },
}, {
    id: "edit",
    sortable: false,
    width: 1,
    renderer: (record, col, meta) => {
        return (
            <Button
                onClick={(event) => {
                    event.stopPropagation();
                    meta.sendMessage("edit");
                }}
            >
                Edit
            </Button>
        );
    },
}];

const getGenderClassName = (gender: string) =>
    gender === "Male" ? css.blue : gender === "Female" ? css.pink : null;

function TablePage() {
    const data = useLoaderData({ from: "/some-framework/table" });
    const [selection, setSelection] = useState<Record<number, boolean>>({});
    const [sortInfo, setSortInfo] = useState<
        SortInfo<User, Record<number, boolean>> | undefined
    >(undefined);

    const formcChangeHandler = (event: React.FormEvent<HTMLFormElement>) => {
        const el = event.target as HTMLInputElement;
        startTransition(() => {
            if (el.name === "row-selection") {
                setSelection((state) => {
                    const draft = Object.assign({}, state);

                    if (el.checked) {
                        draft[parseInt(el.value)] = true;
                    } else {
                        delete draft[parseInt(el.value)];
                    }

                    return draft;
                });
            } else if (el.name === "select-all") {
                setSelection((state) => {
                    if (el.checked) {
                        const draft = Object.assign({}, state);
                        data.forEach((record) => {
                            draft[record.id] = true;
                        });
                        return draft;
                    } else {
                        return {};
                    }
                });
            }
        });
    };

    const rowClassName = (record: User) =>
        classNames(
            getGenderClassName(record.gender),
            selection[record.id] && css.selected,
        );

    const cellMessageHandler = (messsage: string, record: User) => {
        console.log(messsage, record);
    };

    const cellClickHandler = (event: unknown, record: User) => {
        startTransition(() => {
            const id = record.id;
            setSelection((state) => {
                const draft = Object.assign({}, state);

                if (draft[id]) {
                    delete draft[id];
                } else {
                    draft[id] = true;
                }

                return draft;
            });
        });
    };

    const headerClickHandler = (
        event: React.MouseEvent<HTMLTableCellElement>,
        column: TableColumn<User, Record<number, boolean>>,
    ) => {
        if (column.sortable !== false) {
            if (sortInfo != null && sortInfo.columnId === column.id) {
                setSortInfo({
                    columnId: column.id,
                    direction: sortInfo.direction === "ASC" ? "DSC" : "ASC",
                });
            } else {
                setSortInfo({
                    columnId: column.id,
                    direction: "ASC",
                });
            }
        }
    };

    const sortedData = useMemo(() => {
        if (sortInfo == null) {
            return data;
        }

        const prop = sortInfo.columnId;

        switch (prop) {
            case "first_name":
            case "last_name":
            case "gender":
            case "email":
                return data.slice().sort((a, b) => {
                    return a[prop].localeCompare(b[prop]) *
                        (sortInfo.direction === "ASC" ? 1 : -1);
                });
        }

        return data;
    }, [sortInfo, data]);

    return (
        <form
            onSubmit={(event) => event.preventDefault()}
            onChange={formcChangeHandler}
        >
            <ScrollableTable
                rowKey="id"
                columns={columns}
                data={sortedData}
                metaData={selection}
                rowClassName={rowClassName}
                onCellMessage={cellMessageHandler}
                onCellClick={cellClickHandler}
                onHeaderClick={headerClickHandler}
                sortable
                sortInfo={sortInfo}
                style={{ height: 400 }}
            />
        </form>
    );
}

const tableRoute = createRoute({
    getParentRoute: () => indexRoute,
    path: "table",
    loader: async () => {
        const response = await fetch("/some-framework/data/users.json");
        const users = await response.json() as User[];
        return users.slice(0, 100);
    },
    component: TablePage,
});

export { tableRoute };
