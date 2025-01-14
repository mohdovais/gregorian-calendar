import { JSX } from "react";

type SortIconProps = {
    dir?: "ASC" | "DSC";
    className?: string;
};

function SortIcon(props: SortIconProps): JSX.Element {
    const dir = props.dir;

    return (
        <svg
            viewBox="0 0 320 512"
            width="16"
            height="16"
            className={props.className}
        >
            <path
                d="M279 224H41c-21.4 0-32.1-25.9-17-41L143 64c9.4-9.4 24.6-9.4 33.9 0l119 119c15.2 15.1 4.5 41-16.9 41z"
                fill={dir === "ASC" ? "CurrentColor" : "#ccc"}
            />
            <path
                d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41z"
                fill={dir === "DSC" ? "CurrentColor" : "#ccc"}
            />
        </svg>
    );
}

export { SortIcon };
