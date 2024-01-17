import { Subscription } from "stompjs";
import Styles from "../chess.styles";
import FreemodeHandler from "../websocket/Freemode.socket/freemode.handler";

const Move = (
  data: any,
  mode: "Free" | "Multi",
  subscribe: Subscription | undefined
) => {
  const move = data;
  const dispatch = mode === "Free" ? FreemodeHandler.dispatch : null;

  subscribe && subscribe.unsubscribe();
  console.log(move);

  if (!move.status || !dispatch) return;

  dispatch({
    type: "SETBOARD",
    payload: move.board,
  });

  Styles.Remove();
  data.game_status === "checkmate" &&
    dispatch({
      type: "SETWINNER",
      payload: data.winner.toLowerCase(),
    });

  const canAppendPieceMoves = [
    "Normal",
    "White_EnPassant",
    "Black_EnPassant",
    "Promotion",
  ];
  /*moveHandler(
      piece,
      move.flag,
      move.promotion,
      move.move_type,
      move.game_status
    );*/

  const poss = new Map();

  for (const i in data.allPossibleMoves) poss.set(i, data.allPossibleMoves[i]);
  //Remove();

  dispatch({ type: "SETSELECTED", payload: null });
  dispatch({
    type: "SETPOSS",
    payload: poss,
  });

  //this.updateFen(move.fen);
  dispatch({
    type: "SETNOTATION",
    payload: move.notation,
  });

  dispatch({ type: "SETFEN", payload: move.fen });
  dispatch({
    type: "SETHISTORY",
    payload: move.board_track,
  });
  dispatch({
    type: "SETCAPTURED",
    payload: move.captured,
  });

  /*if (mode === "Multi" && move.game_status !== "on_game")
      MultiplayerSocketClientTest.dispatch({
        type: "SETISPLAYING",
        payload: false,
      });*/
};

export default Move;
