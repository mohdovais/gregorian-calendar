import React from "react";
import css from "./Toolbar.module.css";
import { classNames } from "../utils/string";

interface ToolbarProps extends React.PropsWithChildren {
    id?: string;
    className?: string;
    style?: React.CSSProperties;
}

function Toolbar(props: ToolbarProps) {
    const { id, className, style, children } = props;
    return (
        <div
            id={id}
            className={classNames(css.toolbar, className)}
            style={style}
        >
            {children}
        </div>
    );
}

export { Toolbar };
