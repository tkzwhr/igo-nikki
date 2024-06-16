import { useRef } from "react";
import styled from "styled-components";

import GoPlayer from "@/components/GoPlayer";
import GameInfo from "@/components/import-record/GameInfo";
import type GameData from "@/models/GameData";

type Props = {
  gameData: GameData;
  onUpdate: (gameData: GameData) => void;
};

const Styled = styled.div`
  display: flex;
  gap: 20px;

  .go-player {
    width: 360px;
  }
`;

export default function EditGameInfo(props: Props) {
  // biome-ignore lint/suspicious/noExplicitAny: ignore
  const goPlayerRef = useRef<any>(null);

  return (
    <Styled>
      <div className="go-player">
        <GoPlayer
          sgf={props.gameData.sgfText}
          simplified={true}
          ref={goPlayerRef}
        />
      </div>
      <GameInfo {...props} />
    </Styled>
  );
}
