import { useEffect, useRef } from 'react';
import styled from 'styled-components';

const WGoPlayer = (window as any).WGo.BasicPlayer;

type Props = {
  sgf: string;
  simplified?: boolean;
};

const Styled = styled.div`
  .no-info {
    .wgo-gameinfo {
      top: 0;
    }

    .wgo-commentbox {
      top: 0;
    }
  }
`;

export default function GoPlayer(props: Props) {
  const player = useRef(null);

  useEffect(() => {
    let layout: Record<string, string[]> = {
      bottom: ['Control'],
      right: ['CommentBox'],
    };

    if (props.simplified) {
      layout = {
        bottom: ['Control'],
      };
    }

    new WGoPlayer(player.current, {
      sgf: props.sgf,
      layout,
    });
  }, [props.sgf]);

  return (
    <Styled>
      <div
        ref={player}
        className={props.simplified ? '' : 'wgo-twocols no-info'}
      >
        ご使用のブラウザはWGo.jsに対応していません。
      </div>
    </Styled>
  );
}
