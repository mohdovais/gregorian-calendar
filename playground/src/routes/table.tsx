import { createRoute, useLoaderData } from "@tanstack/react-router";
import { rootRoute } from "./root";
import { Table, TableColumn } from "framework/table";
import css from "./table.module.css";
import { Button } from "framework/button";
import { startTransition, useState } from "react";
import { Checkbox } from "framework/checkbox";
import { classNames } from "framework/utils/string";

type User = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    gender: string;
};

const columns: TableColumn<User, Record<number, boolean>>[] = [{
    id: "select",
    th: true,
    header: (column, settings) => {
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
            />
        );
    },
    renderer: (record, column, settings) => {
        const count = Object.keys(settings.metaData || {}).length;
        return (
            <input
                key={count}
                type="checkbox"
                name="row-selection"
                value={record.id}
                title="Select row"
                defaultChecked={settings.metaData?.[record.id]}
            />
        );
    },
}, {
    id: "fname",
    header: "First Name",
    dataIndex: "first_name",
}, {
    id: "lname",
    header: "Last Name",
    dataIndex: "last_name",
}, {
    id: "name",
    header: "Name",
    renderer: (record) => `${record.first_name} ${record.last_name}`,
}, {
    id: "email",
    header: "Email",
    renderer: (record) => <a href={`mailto:${record.email}`}>{record.email}</a>,
}, {
    id: "gender",
    header: "Gender",
    dataIndex: "gender",
}, {
    id: "edit",
    renderer: (record, col, meta) => {
        return <Button onClick={() => meta.sendMessage("edit")}>Edit</Button>;
    },
}];

const unknownGender = [
    "Genderfluid",
    "Polygender",
    "Bigender",
    "Genderqueer",
    "Non-binary",
];

const getGenderClassName = (gender: string) =>
    gender === "Male"
        ? css.blue
        : gender === "Female"
        ? css.green
        : unknownGender.includes(
                gender,
            )
        ? css.red
        : null;

function TablePage() {
    const data = useLoaderData({ from: "/table" });
    const [selection, setSelection] = useState<Record<number, boolean>>({});

    const changeHandler = (event: React.FormEvent<HTMLFormElement>) => {
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

    return (
        <form
            onSubmit={(event) => event.preventDefault()}
            onChange={changeHandler}
        >
            <Table
                columns={columns}
                data={data}
                metaData={selection}
                rowKey="id"
                rowClassName={(record) =>
                    classNames(
                        getGenderClassName(record.gender),
                        selection[record.id] && css.selected,
                    )}
                onCellMessage={(messsage, record) => {
                    console.log(messsage, record);
                }}
                width="100%"
            />
        </form>
    );
}

const tableRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "table",
    loader: async () => {
        const response = await fetch("/data/users.json");
        return await response.json() as User[];
    },
    component: TablePage,
});

export { tableRoute };
