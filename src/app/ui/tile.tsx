import { config } from "../lib/chess.config";
import Styles from "../lib/chess.styles";
import { useFreemodeContext } from "../lib/context/freemode.context/freemode.provider";
import { stompClientFreemode } from "../lib/socket";
import Move from "../lib/utils/move";
import FreemodeHandler from "../lib/websocket/Freemode.socket/freemode.handler";
import Image from "next/image";
import styles from "./styles/tile.module.css";

const Tile = ({
  children,
  id,
  background,
}: {
  children?: React.ReactNode;
  id: string;
  background: string;
}) => {
  const { state, dispatch } = useFreemodeContext();

  const handleClick = (e: React.MouseEvent) => {
    const el = e.target as HTMLDivElement;
    if (!state.selected) return;

    const pieceIndex = config.id.indexOf(state.selected);
    const enemieIndex = config.id.indexOf(el.id);

    if (
      !state.poss.get(state.selected) ||
      !state.poss.get(state.selected)?.includes(id)
    ) {
      dispatch({ type: "SETSELECTED", payload: null });
      Styles.Remove();
      return;
    }

    let subscribe = stompClientFreemode?.subscribe(
      "/user/queue/freemode/move_status",
      (data: any) => {
        const response = JSON.parse(data.body);
        Move(response, "Free", subscribe);
      }
    );
    FreemodeHandler.Move({ from: state.selected, to: id, promotion: null });

    state.board[enemieIndex] = state.board[pieceIndex];
    state.board[pieceIndex] = "e";
    const newBoard = [...state.board];

    Styles.Remove();
    dispatch({ type: "SETBOARD", payload: newBoard });
    dispatch({ type: "SETSELECTED", payload: null });
  };

  const classWhite =
    +id.slice(0, 1) === 1 ? styles.whitePromotion : styles.blackPromotion;
  const classBlack =
    +id.slice(0, 1) === 8 ? styles.blackPromotion : styles.whitePromotion;

  return (
    <div
      id={id}
      style={{ backgroundColor: background }}
      className={styles.tile}
      onClick={handleClick}
    >
      <div className={`${styles.none} ${styles.bullet}`}></div>
      {children}
      {(+id.slice(-1) === 1 || +id.slice(-1) === 8) && (
        <div
          className={`${+id.slice(-1) === 1 ? classWhite : classBlack} ${
            styles.promotion
          } `}
        >
          <Image
            src={
              +id.slice(-1) === 1
                ? `/images/BlackQueen.png`
                : "/images/WhiteQueen.png"
            }
            className={styles.promotionImg}
            alt=""
            data-type={+id.slice(-1) === 1 ? `q` : "Q"}
            width={55}
            height={50}
          />
          <Image
            src={
              +id.slice(-1) === 1
                ? `/images/BlackRook.png`
                : "/images/WhiteRook.png"
            }
            className={styles.promotionImg}
            alt=""
            data-type={+id.slice(-1) === 1 ? `r` : "R"}
            width={55}
            height={50}
          />
          <Image
            src={
              +id.slice(-1) === 1
                ? `/images/BlackBishop.png`
                : "/images/WhiteBishop.png"
            }
            className={styles.promotionImg}
            alt=""
            data-type={+id.slice(-1) === 1 ? `b` : "B"}
            width={55}
            height={50}
          />
          <Image
            src={
              +id.slice(-1) === 1
                ? `/images/BlackKnight.png`
                : "/images/WhiteKnight.png"
            }
            className={styles.promotionImg}
            alt=""
            data-type={+id.slice(-1) === 1 ? `n` : "N"}
            width={55}
            height={50}
          />
        </div>
      )}
    </div>
  );
};

export default Tile;
