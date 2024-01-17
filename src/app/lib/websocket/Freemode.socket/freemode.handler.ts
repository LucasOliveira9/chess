import Styles from "../../chess.styles";
import { TAction } from "../../context/freemode.context/freemode.interface";
import { stompClientFreemode } from "../../socket";

class FreemodeHandler {
  static dispatch: React.Dispatch<TAction> | null;
  public static setDispatch(dispatch: React.Dispatch<TAction>) {
    this.dispatch = dispatch;
  }
  public static NewGame(data: any) {
    localStorage.setItem("freemode", data.id);

    if (!FreemodeHandler.dispatch) return;
    Styles.Remove();
    const poss = new Map();
    for (const i in data.allPossibleMoves)
      poss.set(i, data.allPossibleMoves[i]);

    FreemodeHandler.dispatch({
      type: "SETBOARD",
      payload: data.board,
    });
    FreemodeHandler.dispatch({ type: "SETPOSS", payload: poss });
    FreemodeHandler.dispatch({ type: "SETNOTATION", payload: [] });
    FreemodeHandler.dispatch({
      type: "SETHISTORY",
      payload: data.board_track,
    });
    FreemodeHandler.dispatch({ type: "SETFEN", payload: data.fen });
    FreemodeHandler.dispatch({
      type: "SETCAPTURED",
      payload: data.captured,
    });
  }

  public static Restart(data: any) {
    if (!data) return; //alert(data.message);

    if (!FreemodeHandler.dispatch) return;
    Styles.Remove();
    const poss = new Map();
    for (const i in data.allPossibleMoves)
      poss.set(i, data.allPossibleMoves[i]);

    FreemodeHandler.dispatch({
      type: "SETFEN",
      payload: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    });
    FreemodeHandler.dispatch({ type: "SETHISTORY", payload: [] });
    FreemodeHandler.dispatch({ type: "SETNOTATION", payload: [] });
    FreemodeHandler.dispatch({
      type: "SETBOARD",
      payload: data.board,
    });
    FreemodeHandler.dispatch({ type: "SETPOSS", payload: poss });
    FreemodeHandler.dispatch({ type: "RESTARTBOARD" });
    FreemodeHandler.dispatch({ type: "SETCAPTURED", payload: [] });
  }

  public static Move({
    from,
    to,
    promotion,
  }: {
    from: string;
    to: string;
    promotion: string | null;
  }) {
    const id = localStorage.getItem("freemode");
    if (!id) return;
    stompClientFreemode?.send(
      "/chess/topic/freemode/move",
      {},
      JSON.stringify({ from, to, promotion, id })
    );
  }

  public static SetBoard(data: any) {
    if (!data || !FreemodeHandler.dispatch) return;
    Styles.Remove();

    const poss = new Map();
    for (const i in data.allPossibleMoves)
      poss.set(i, data.allPossibleMoves[i]);

    FreemodeHandler.dispatch({
      type: "SETBOARD",
      payload: data.board,
    });
    FreemodeHandler.dispatch({ type: "SETPOSS", payload: poss });
    FreemodeHandler.dispatch({ type: "RESTARTBOARD" });
    FreemodeHandler.dispatch({ type: "SETFEN", payload: data.fen });
    FreemodeHandler.dispatch({ type: "SETHISTORY", payload: [] });
    FreemodeHandler.dispatch({ type: "SETNOTATION", payload: [] });
    FreemodeHandler.dispatch({ type: "SETCAPTURED", payload: [] });
  }
}

export default FreemodeHandler;
