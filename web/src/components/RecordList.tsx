import useRecord from '@/hooks/record';
import { Button, Menu, Popconfirm, Space } from 'antd';
import React, { useMemo } from 'react';
import { parse } from '@/helpers/sgf.helper';
import { format } from 'date-fns';
import CrownOutlined from '@ant-design/icons/CrownOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import styled from 'styled-components';

const Styled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;

  .game-name {
    max-width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .delete {
    visibility: hidden;
  }

  &:hover {
    .game-name {
      max-width: 180px;
    }

    .delete {
      visibility: visible;
    }
  }
`;

type SGFInfo = {
  id: number;
  gameName: string;
  won: boolean;
};

type Props = {
  records: ReturnType<typeof useRecord>[0]['data'];
  selectedRecordId: number;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function RecordList(props: Props) {
  const menuItems = useMemo<any[]>(() => {
    const grouped = new Map<string, SGFInfo[]>();

    props.records.forEach((record) => {
      const id = record.id;
      const gameData = parse(record.sgf_text);
      const date =
        gameData?.playedAt !== undefined
          ? format(gameData?.playedAt, 'yyyy年M月d日')
          : '(不明)';
      const gameName = gameData?.gameName ?? '(タイトルなし)';
      const won =
        gameData?.result?.startsWith(record.player_color.charAt(0) ?? '0') ??
        false;

      const infos = grouped.get(date);
      if (infos === undefined) {
        grouped.set(date, [{ id, gameName, won }]);
      } else {
        grouped.set(date, [...infos, { id, gameName, won }]);
      }
    });

    return Array.from(grouped.keys())
      .sort()
      .reverse()
      .map((key) => {
        const infos = grouped.get(key)!;
        return {
          key,
          label: key,
          children: infos.map((info) => ({
            key: info.id,
            label: (
              <Styled>
                <Space>
                  <CrownOutlined />
                  <div className="game-name">{info.gameName}</div>
                </Space>
                <Popconfirm
                  title="本当に削除しますか？"
                  onConfirm={() => props.onDelete(info.id)}
                >
                  <Button
                    className="delete"
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                  />
                </Popconfirm>
              </Styled>
            ),
          })),
        };
      });
  }, [props.records]);

  const menuKeys = useMemo<string[]>(
    () => menuItems.map((item) => item.key),
    [menuItems],
  );

  return (
    <Menu
      className="menu"
      defaultOpenKeys={menuKeys}
      selectedKeys={[props.selectedRecordId.toString(10)]}
      onClick={(e) => props.onSelect(parseInt(e.key))}
      mode="inline"
      inlineCollapsed={false}
      items={menuItems}
    />
  );
}
