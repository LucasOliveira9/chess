import { config } from "../chess/chess.config";
import Styles from "../chess/chess.styles";
import {
  IState,
  TAction,
} from "../context/freemode.context/freemode.interface";
import {
  IState as MState,
  TAction as MAction,
} from "../context/multiplayer.context/multiplayer.interface";

const LocalMove = (
  from: number,
  to: number,
  state: IState | MState,
  dispatch: React.Dispatch<TAction> | React.Dispatch<MAction>
) => {
  const fromPiece = state.board[from];
  const newBoard = [...state.board];
  let isCastling = false;

  if (fromPiece.toLowerCase() == "k") {
    if (from === 4 && to >= 6 && to <= 7) {
      newBoard[6] = fromPiece;
      newBoard[5] = newBoard[7];
      newBoard[7] = "e";
      newBoard[4] = "e";
      isCastling = true;
    } else if (from === 4 && to <= 2) {
      newBoard[2] = fromPiece;
      newBoard[3] = newBoard[0];
      newBoard[0] = "e";
      newBoard[4] = "e";
      isCastling = true;
    }

    if (from === 60 && to >= 62) {
      newBoard[62] = fromPiece;
      newBoard[61] = newBoard[63];
      newBoard[63] = "e";
      newBoard[60] = "e";
      isCastling = true;
    } else if (from === 60 && to >= 56 && to <= 58) {
      newBoard[58] = fromPiece;
      newBoard[59] = newBoard[56];
      newBoard[56] = "e";
      newBoard[60] = "e";
      isCastling = true;
    }
  }

  /*EnPassant capture */
  if (
    fromPiece.toLowerCase() == "p" &&
    config.id[from].slice(0, 1) !== config.id[to].slice(0, 1) &&
    newBoard[to] === "e"
  ) {
    if (+config.id[from].slice(1) > +config.id[to].slice(1))
      newBoard[to - 8] = "e";
    else newBoard[to + 8] = "e";
  }
  /*standard*/

  if (!isCastling) {
    newBoard[from] = "e";
    newBoard[to] = fromPiece;
  }

  dispatch({ type: "SETBOARD", payload: newBoard });
  dispatch({ type: "SETSELECTED", payload: null });
  dispatch({ type: "SETPOSS", payload: new Map() });
  Styles.Remove();
};

export default LocalMove;
