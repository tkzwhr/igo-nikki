import CrownOutlined from "@ant-design/icons/CrownOutlined";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import { Button, Popconfirm, Space } from "antd";
import styled from "styled-components";

import type { ExtendedRecord } from "@/hooks/home.reducer";

type Props = {
  data: ExtendedRecord;
  onDelete: (id: number) => void;
};

const StyledDiv = styled.div`
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

export function ListItem(props: Props) {
  return (
    <StyledDiv>
      <Space>
        <CrownOutlined
          style={{ visibility: props.data.won ? "visible" : "hidden" }}
        />
        <div className="game-name">{props.data.gameName}</div>
      </Space>
      <Popconfirm
        title="本当に削除しますか？"
        onConfirm={() => props.onDelete(props.data.id)}
      >
        <Button
          className="delete"
          type="primary"
          danger
          icon={<DeleteOutlined />}
          size="small"
        />
      </Popconfirm>
    </StyledDiv>
  );
}
