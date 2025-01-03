import { useState } from "react";
import { Table, TableProps } from "../table";
import { classNames } from "../utils/string";

import css from "./scrollable-table.module.css";

// credit:https://wpdatatables.com/html-table-with-fixed-header-and-scrollable-body/

const setStickyState = (
  el: HTMLDivElement | null,
  setState: React.Dispatch<
    React.SetStateAction<{
      head: boolean;
      foot: boolean;
    }>
  >,
) => {
  if (el == null) {
    return;
  }

  const scrollTop = el.scrollTop;

  setState((state) => {
    const foot = scrollTop !== el.scrollHeight - el.clientHeight;
    const head = scrollTop !== 0;

    return state.foot === foot && state.head === head ? state : {
      foot: scrollTop !== el.scrollHeight - el.clientHeight,
      head: scrollTop !== 0,
    };
  });
};

function ScrollableTable<T, U>(props: TableProps<T, U>) {
  const { width, id, className, style, ...tableProps } = props;
  const [sticky, setSticky] = useState({
    head: false,
    foot: false,
  });

  const scrollHandler = (event: React.UIEvent<HTMLDivElement>) => {
    setStickyState(event.target as HTMLDivElement, setSticky);
  };

  return (
    <div
      id={id}
      className={classNames(
        css.wrapper,
        sticky.foot && css.foot_sticky,
        sticky.head && css.head_sticky,
        className,
      )}
      style={style}
      onScroll={scrollHandler}
      onResize={scrollHandler}
      ref={(el) => {
        setStickyState(el, setSticky);
      }}
    >
      <Table width="100%" {...tableProps} />
    </div>
  );
}

export { ScrollableTable };
