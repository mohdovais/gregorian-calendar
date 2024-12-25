import { createRoute, useLoaderData } from "@tanstack/react-router";
import { rootRoute } from "./root";
import { Table, TableColumn } from "framework/table";
import css from "./table.module.css";
import { Button } from "framework/button";

type User = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    gender: string;
};

const columns: TableColumn<User>[] = [{
    id: "select",
    th: true,
    header: <input type="checkbox" title="Select all" />,
    renderer: (record) => {
        return <input type="checkbox" title="Select row" />;
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

const rowClassName = (record: User) =>
    record.gender === "Male"
        ? css.blue
        : record.gender === "Female"
        ? css.green
        : unknownGender.includes(
                record.gender,
            )
        ? css.red
        : null;

function TablePage() {
    const data = useLoaderData({ from: "/table" });

    return (
        <Table
            columns={columns}
            data={data}
            rowKey="id"
            rowClassName={rowClassName}
            onCellMessage={(messsage, record) => {
                console.log(messsage, record);
            }}
            width="100%"
        />
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
