import { RangeSlider } from "framework/range-slider";
import { useDeferredValue, useState } from "react";

function RangeSliderPage() {
    const [value, setValue] = useState({ start: 25, end: 50 });
    const deferredValue = useDeferredValue(value);
    return (
        <RangeSlider
            value={deferredValue}
            onChange={setValue}
            style={{ width: "100%" }}
        />
    );
}

export { RangeSliderPage };
