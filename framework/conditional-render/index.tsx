type ConditionalRenderProps = React.PropsWithChildren & {
    when?: boolean;
};

function ConditionalRender(props: ConditionalRenderProps) {
    const { when = true, children } = props;

    return when ? children : null;
}

export { ConditionalRender };
