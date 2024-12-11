import { Input, InputProps } from "../input";
import { classname } from "../utils/classname";
import css from "./Search.module.css";

type SearchProps = InputProps & {};

function Search(props: SearchProps) {
    const { type = "search", className, ...restProps } = props;
    return (
        <Input
            type={type}
            className={classname(css.search, className)}
            {...restProps}
        />
    );
}

export { Search };
export type { SearchProps };
