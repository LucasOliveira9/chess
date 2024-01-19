import { config } from "../../../lib/chess/chess.config";
import Styles from "@/app/lib/chess/chess.styles";
import { stompClientFreemode } from "@/app/lib/socket/socket";
import Move from "@/app/lib/utils/move";
import FreemodeHandler from "@/app/lib/websocket/freemode.socket/freemode.handler";
import Image from "next/image";
import styles from "../../styles/tile/index.module.scss";
import Promotion from "@/app/lib/utils/promotion";
import LocalMove from "@/app/lib/utils/move.local";
import { usePathname } from "next/navigation";
import { useContext } from "@/app/lib/context/context";

const Tile = ({
  children,
  id,
  background,
}: {
  children?: React.ReactNode;
  id: string;
  background: string;
}) => {
  const path = usePathname();
  const { state, dispatch } = useContext(path);

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

    if (
      (enemieIndex >= 56 || enemieIndex <= 7) &&
      state.board[pieceIndex].toLowerCase() === "p"
    ) {
      const piece = document
        .getElementById(state.selected)
        ?.querySelector(`.${styles.piece}`);
      piece && ((piece as HTMLElement).style.opacity = "0");
      Promotion(state.selected, id, enemieIndex, pieceIndex, state, dispatch);
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
    LocalMove(pieceIndex, enemieIndex, state, dispatch);
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
          } ${styles.none} `}
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
            placeholder="blur"
            blurDataURL={`/images/${
              config.image[
                +id.slice(-1) === 1 ? `q` : ("Q" as keyof typeof config.image)
              ]
            }`}
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
            placeholder="blur"
            blurDataURL={`/images/${
              config.image[
                +id.slice(-1) === 1 ? `r` : ("R" as keyof typeof config.image)
              ]
            }`}
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
            placeholder="blur"
            blurDataURL={`/images/${
              config.image[
                +id.slice(-1) === 1 ? `b` : ("B" as keyof typeof config.image)
              ]
            }`}
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
            placeholder="blur"
            blurDataURL={`/images/${
              config.image[
                +id.slice(-1) === 1 ? `n` : ("N" as keyof typeof config.image)
              ]
            }`}
          />
        </div>
      )}
    </div>
  );
};

export default Tile;
