import { JSX } from "react";
import { Input, InputProps } from "../input";
import { classNames } from "../utils/string";

import css from "./Search.module.css";

type SearchProps = InputProps & {};

function Search(props: SearchProps): JSX.Element {
    const { type = "search", className, ...restProps } = props;
    return (
        <Input
            type={type}
            className={classNames(css.search, className)}
            {...restProps}
        />
    );
}

export { Search };
export type { SearchProps };
