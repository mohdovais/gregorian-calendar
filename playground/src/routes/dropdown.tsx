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
                    <Button type="submit">Submit</Button>
                </Toolbar>
            </form>
            <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
            </p>
            <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
            </p>
            <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
            </p>
            <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
            </p>
            <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
            </p>
            <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
            </p>
            <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
            </p>
        </div>
    );
}

const dropdownRoute = createRoute({
    getParentRoute: () => indexRoute,
    path: "dropdown",
    component: RouteComponent,
});

export { dropdownRoute };
