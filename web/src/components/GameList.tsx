import { ListItem } from "@/components/ListItem";
import type { ExtendedRecord } from "@/hooks/home.reducer";
import { Menu } from "antd";
import { useMemo } from "react";
import styled from "styled-components";

type Props = {
  records: ExtendedRecord[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
};

const StyledMenu = styled(Menu)`
  border-inline-end-width: 0 !important;
`;

export default function GameList(props: Props) {
  const menuItems = useMemo(() => {
    const groupedRecords = groupBy(props.records, (v) => v.date ?? "(不明)");
    const arr = Array.from(groupedRecords.entries()).map(([key, value]) => ({
      type: "group",
      label: key,
      children: value.map((v) => ({
        key: v.id.toString(10),
        label: <ListItem data={v} onDelete={props.onDelete} />,
      })),
    }));
    // biome-ignore lint/suspicious/noExplicitAny: ignore
    return arr as any;
  }, [props.records, props.onDelete]);

  return (
    <StyledMenu
      items={menuItems}
      selectedKeys={[props.selectedId?.toString() ?? ""]}
      onSelect={(info) => props.onSelect(Number.parseInt(info.key))}
    />
  );
}

function groupBy<T>(arr: T[], f: (el: T) => string): Map<string, T[]> {
  return arr.reduce((acc, v) => {
    const key = f(v);
    const newValue = [...(acc.get(key) ?? []), v];
    acc.set(key, newValue);
    return acc;
  }, new Map<string, T[]>());
}
