import { createRoute } from "@tanstack/react-router";
import { Dropdown } from "framework/dropdown";
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
        const [value, setValue] = useState("AZ");
        return (
            <Dropdown
                label="Country"
                required
                value={value}
                onChange={setValue}
            >
                {data.map((country) => (
                    <Dropdown.Option key={country.code} value={country.code}>
                        {country.name}
                    </Dropdown.Option>
                ))}
            </Dropdown>
        );
    },
});

export { dropdownRoute };
