import { createRoute } from "@tanstack/react-router";
import { indexRoute } from "./index.route";
import { FixedMenu } from "./menu-button/fixed-menu";

const menuButtonRoute = createRoute({
    getParentRoute: () => indexRoute,
    path: "menu-button",
    component: () => {
        return (
            <>
                <FixedMenu />
            </>
        );
    },
});

export { menuButtonRoute };
