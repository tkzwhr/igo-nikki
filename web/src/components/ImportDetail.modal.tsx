import { Modal } from 'antd';
import GoPlayer from '@/components/GoPlayer';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import GameInfo from '@/components/GameInfo';
import { GameData, parse, update } from '@/helpers/sgf.helper';
import { ImportData } from '@/helpers/import.helper';

type Props = {
  isOpen: boolean;
  sgf: string;
  submit: (importData?: ImportData) => void;
};

const Styled = styled.div`
  display: flex;
  gap: 20px;

  .go-player {
    width: 360px;
  }
`;

export default function ImportDetailModal(props: Props) {
  const [initialGameData, setInitialGameData] = useState<
    undefined | GameData
  >();
  const [gameData, setGameData] = useState<undefined | GameData>();

  useEffect(() => {
    if (props.isOpen) {
      const gameData = parse(props.sgf)!;
      setInitialGameData(gameData);
      setGameData(gameData);
    } else {
      setInitialGameData(undefined);
    }
  }, [props.isOpen]);

  const onSubmit = () => {
    const updatedSgf = update(props.sgf, gameData!) ?? props.sgf;
    props.submit({
      sgf: updatedSgf,
      playerColor: gameData!.playerColor!,
    });
  };

  return (
    <Modal
      title="棋譜をインポートする"
      open={props.isOpen}
      onOk={onSubmit}
      onCancel={() => props.submit()}
      width={720}
    >
      {initialGameData !== undefined && (
        <Styled>
          <div className="go-player">
            <GoPlayer sgf={props.sgf} simplified={true} />
          </div>
          <GameInfo
            initialValue={initialGameData}
            onGameDataUpdate={setGameData}
          />
        </Styled>
      )}
    </Modal>
  );
}
