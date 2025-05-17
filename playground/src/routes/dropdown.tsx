import { createRoute } from "@tanstack/react-router";
import { Dropdown } from "framework/dropdown";
import { startTransition, useDeferredValue, useEffect, useState } from "react";
import { Toolbar } from "framework/toolbar";
import { Button } from "framework/button";
import { ProxyFormInput } from "framework/proxy-form-input";
import { indexRoute } from "./index.route";

type User = {
    "id": 1;
    "firstName": string;
    "lastName": string;
    "email": string;
};

type UserResponse = {
    users: User[];
};

function searchUsers(query: string, signal: AbortSignal): Promise<User[]> {
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
type OptionType = {
    value: User;
    label: React.ReactElement;
};

function RouteComponent() {
    const [query, setQuery] = useState("");
    const [options, setOptions] = useState<OptionType[]>([]);
    const [value, setValue] = useState<User | undefined>();
    const deferredQuery = useDeferredValue(query).trim();

    useEffect(() => {
        const controller = new AbortController();
        if (deferredQuery === "") {
            setOptions([]);
        } else {
            searchUsers(deferredQuery, controller.signal).then((data) => {
                const options = data.map((user) => {
                    return {
                        value: user,
                        label: (
                            <div>
                                <div>
                                    {`${user.firstName} ${user.lastName}`}
                                </div>
                                <small>{user.email}</small>
                            </div>
                        ),
                    };
                });
                startTransition(() => {
                    setOptions(options);
                });
            });
        }

        return () => {
            controller.abort();
        };
    }, [deferredQuery]);

    return (
        <div>
            <form>
                <Toolbar>
                    <ProxyFormInput
                        name="user"
                        value={value?.email ?? ""}
                        required
                    >
                        <Dropdown
                            label={value == null ? "Select a user" : "User"}
                            required
                            value={value}
                            items={options}
                            displayTpl={() => value?.email ?? ""}
                            onChange={setValue}
                            onSearch={setQuery}
                        />
                    </ProxyFormInput>
                    <Dropdown
                        label={value == null ? "Select a user" : "User"}
                        items={[{label: "hello", value:"hello"}]}
                        displayTpl={() => value?.email ?? ""}
                        onChange={(selection)=>{}}
                    />
                    <Button type="submit">Submit</Button>
                </Toolbar>
            </form>
        </div>
    );
}

const dropdownRoute = createRoute({
    getParentRoute: () => indexRoute,
    path: "dropdown",
    component: RouteComponent,
});

export { dropdownRoute };
