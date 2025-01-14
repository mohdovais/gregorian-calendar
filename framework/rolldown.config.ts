import { defineConfig, RolldownOptions } from "rolldown";
//import IsolatedDecl from "unplugin-isolated-decl/rolldown";

const folders_tsx = [
    "base-button",
    "datefield",
    "input",
    // "proxy-form-input",
    "step-tabs",
    "year-selector",
    "button",
    "listbox",
    "radio",
    "table",
    "calendar",
    "dropdown",
    "month",
    "textfield",
    "checkbox",
    "month-selector",
    "toolbar",
    "checkbox-group",
    "scrollable-table",
    "conditional-render",
    //"hooks",
    //"portal",
    "search",
];

export default defineConfig(folders_tsx.map((name) => {
    const config: RolldownOptions = {
        input: `${name}/index.tsx`,
        output: {
            format: "esm",
            file: `dist/${name}/index.js`,
        },
        external: (source, importer, resolved) => {
            if (
                source.startsWith("react") ||
                source.startsWith("@floating-ui") ||
                source.startsWith("../") ||
                source.includes("node_modules") ||
                source.endsWith(".css")
            ) {
                return true;
            }
        },
    };

    return config;
}));
