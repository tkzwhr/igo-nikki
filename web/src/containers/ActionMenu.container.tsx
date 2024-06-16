import DownloadOutlined from "@ant-design/icons/DownloadOutlined";
import { Button, Card } from "antd";
import { format } from "date-fns";
import { useCallback, useContext } from "react";
import styled from "styled-components";

import { HomeContext } from "@/hooks/home.reducer";

const StyledCard = styled(Card)`
  width: 360px;
`;

export default function ActionMenuContainer() {
  const [store] = useContext(HomeContext);

  const onExportRecords = useCallback(() => {
    const textData = store.records.map((r) => r.sgf_text).join("");
    const filename = `${format(new Date(), "yyyy-MM-dd_HH-mm-ss")}.sgf`;

    const blob = new Blob([textData], { type: "text/plain" });
    const link = document.createElement("a");
    link.download = filename;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  }, [store]);

  return (
    <StyledCard>
      <Button
        block
        shape="round"
        icon={<DownloadOutlined />}
        onClick={onExportRecords}
      >
        エクスポート
      </Button>
    </StyledCard>
  );
}
