import { createRoute } from "@tanstack/react-router";
import { Dropdown } from "framework2/dropdown";
import { rootRoute } from "./root";
import { useDeferredValue, useMemo, useState } from "react";

type User = {
    "id": 1;
    "firstName": string;
    "lastName": string;
    "email": string;
};

type UserResponse = {
    users: User[];
};

function searchUsers(query: string, signal: AbortSignal) {
    return fetch(
        `https://dummyjson.com/users/search?q=${query}&select=firstName,lastName,email`,
        { signal },
    ).then((response) => response.json() as Promise<UserResponse>)
        .then(
            (json) => json.users,
            (error: unknown) => {
                if (error instanceof Error && error.name === "AbortError") {
                    return [];
                }

                throw error;
            },
        );
}

let lastAbort: (reason?: string) => void = () => {};

const dropdownRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "dropdown",
    component: () => {
        const [data, setData] = useState<User[]>([]);
        const [value, setValue] = useState<number | undefined>();
        const deferredData = useDeferredValue(data);

        return (
            <div>
                <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting, remaining
                    essentially unchanged. It was popularised in the 1960s with
                    the release of Letraset sheets containing Lorem Ipsum
                    passages, and more recently with desktop publishing software
                    like Aldus PageMaker including versions of Lorem Ipsum.
                </p>
                <Dropdown
                    label={value == null ? "Select a country" : "Country"}
                    value={value}
                    items={deferredData.map((x) => ({
                        value: x.id,
                        label: `${x.firstName} ${x.lastName}`,
                    }))}
                    onChange={setValue}
                    onSearch={(query) => {
                        lastAbort();
                        const controller = new AbortController();
                        searchUsers(query, controller.signal).then(setData);
                        lastAbort = controller.abort.bind(controller);
                    }}
                />
            </div>
        );
    },
});

export { dropdownRoute };
