import { config } from "../lib/chess.config";
import Styles from "../lib/chess.styles";
import { useFreemodeContext } from "../lib/context/freemode.context/freemode.provider";
import { stompClientFreemode } from "../lib/socket";
import Move from "../lib/utils/move";
import FreemodeHandler from "../lib/websocket/Freemode.socket/freemode.handler";
import styles from "./styles/tile.module.css";

const tileStyle = {
  height: "4.5em",
  width: "4.5em",
  flex: "0 0 calc(12.5%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

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
  return (
    <div
      id={id}
      style={{ ...tileStyle, backgroundColor: background }}
      className={`tile`}
      onClick={handleClick}
    >
      <div className={`${styles.none} ${styles.bullet}`}></div>
      {children}
    </div>
  );
};

export default Tile;
