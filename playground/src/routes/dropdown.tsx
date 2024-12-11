import { createRoute } from "@tanstack/react-router";
import { Dropdown } from "framework2/dropdown";
import { rootRoute } from "./root";
import { useState } from "react";

type Country = { name: string; code: string };

const dropdownRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "dropdown",
    loader: async () => {
        const response = await fetch("/data/countries.json");
        return response.json() as Promise<Country[]>;
    },
    component: () => {
        const data = dropdownRoute.useLoaderData();
        const [value, setValue] = useState("IN");
        return (
            <Dropdown
                label="Country"
                required
                value={value}
                items={[{
                    label: "All",
                    children: data.map((country) => ({
                        value: country.code,
                        label: country.name,
                    })),
                }]}
                onChange={setValue}
            />
        );
    },
});

export { dropdownRoute };
