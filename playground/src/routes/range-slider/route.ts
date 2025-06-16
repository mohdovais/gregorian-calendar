import { createRoute } from "@tanstack/react-router";
import { indexRoute } from "../index.route";
import { RangeSliderPage } from ".";

const rangeSliderRoute = createRoute({
    getParentRoute: () => indexRoute,
    path: "range-slider",
    component: RangeSliderPage,
});

export { rangeSliderRoute };
