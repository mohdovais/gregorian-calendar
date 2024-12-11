interface SearchFieldProps extends
    React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    > {}

function SearchField(props: SearchFieldProps) {
    const { type = "search" } = props;
    return <input type="search" />;
}
