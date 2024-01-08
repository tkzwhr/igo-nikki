import {
  ForwardedRef,
  forwardRef,
  MutableRefObject,
  useEffect,
  useRef,
} from 'react';
import styled from 'styled-components';

const WGoPlayer = (window as any).WGo.BasicPlayer;

type Props = {
  sgf: string;
  simplified?: boolean;
};

const StyledDiv = styled.div`
  .no-info {
    .wgo-gameinfo {
      top: 0;
    }

    .wgo-commentbox {
      top: 0;
    }
  }
`;

function Inner(props: Props, ref: ForwardedRef<any>) {
  const playerRef = useRef(null);

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

    if (ref) {
      (ref as MutableRefObject<any>).current = new WGoPlayer(
        playerRef.current,
        {
          sgf: props.sgf,
          layout,
        },
      );
    }
  }, [props.sgf]);

  return (
    <StyledDiv>
      <div
        ref={playerRef}
        className={props.simplified ? '' : 'wgo-twocols no-info'}
      >
        ご使用のブラウザはWGo.jsに対応していません。
      </div>
    </StyledDiv>
  );
}

const GoPlayer = forwardRef(Inner);

export default GoPlayer;
