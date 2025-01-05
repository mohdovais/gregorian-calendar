import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";

const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "some-framework",
});

export { indexRoute };
