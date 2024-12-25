import { useEffect, useRef } from "react";

interface CheckboxProps extends
    React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    > {
    intermediate?: boolean;
}

function Checkbox(
    props: CheckboxProps,
) {
    const { type, intermediate = false, ...checkboxProps } = props;
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (ref.current != null) {
            ref.current.indeterminate = intermediate;
        }
    }, [intermediate]);

    return <input type="checkbox" {...checkboxProps} ref={ref} />;
}

export { Checkbox };
