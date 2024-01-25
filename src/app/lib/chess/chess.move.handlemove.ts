import {
  IState,
  TAction,
} from "../context/freemode.context/freemode.interface";
import {
  IState as MState,
  TAction as MAction,
} from "../context/multiplayer.context/multiplayer.interface";
import { stompClientFreemode, stompClientMultiplayer } from "../socket/socket";
import Move from "../utils/move";
import LocalMove from "../utils/move.local";
import Promotion from "../utils/promotion";
import FreemodeHandler from "../websocket/freemode.socket/freemode.handler";
import MultiplayerSocket from "../websocket/multiplayer.socket/multiplayer.socket";
import { config } from "./chess.config";
import Styles from "./chess.styles";
import styles from "@/app/ui/styles/tile/index.module.scss";

class HandleMove {
  private state: IState | MState;
  private dispatch: React.Dispatch<TAction> | React.Dispatch<MAction>;
  private path: string;

  constructor(
    state: IState | MState,
    dispatch: React.Dispatch<TAction> | React.Dispatch<MAction>,
    path: string
  ) {
    this.state = state;
    this.dispatch = dispatch;
    this.path = path;
  }
  /*Handle move on dragging*/
  public handleMouseDown(e: React.MouseEvent<HTMLImageElement>) {
    e.preventDefault();
    e.stopPropagation();

    const piece = e.target as HTMLImageElement;
    const clonedPiece = piece.cloneNode(false) as HTMLImageElement;
    const curr = piece?.parentElement?.id;

    if (!curr || !clonedPiece || !piece || e.buttons !== 1 || !this.state)
      return;

    if (curr !== this.state.selected) Styles.Remove();
    Styles.Selected(curr);
    this.dispatch({ type: "SETSELECTED", payload: curr });
    const idx = config.id.indexOf(curr);

    let x = e.clientX - piece.getBoundingClientRect().left;
    let y = e.clientY - piece.getBoundingClientRect().top;

    clonedPiece.style.zIndex = "1000";
    clonedPiece.style.position = "absolute";
    clonedPiece.style.cursor = "grabbing";
    piece.style.opacity = "0";

    const width = (e.target as HTMLImageElement).style.width;
    const height = (e.target as HTMLImageElement).style.height;

    document.body.append(clonedPiece);

    clonedPiece.style.width = width;
    clonedPiece.style.height = height;

    const MoveAt = (px: number, py: number) => {
      const moveX = px - x,
        moveY = py - y;

      clonedPiece.style.left = `${moveX}px`;
      clonedPiece.style.top = `${moveY}px`;
    };

    MoveAt(e.pageX, e.pageY);

    const onMouseMove = (event: Event) => {
      event.preventDefault();
      const target = event as unknown as MouseEvent;

      MoveAt(target.pageX, target.pageY);
    };

    document.addEventListener("mousemove", onMouseMove);

    clonedPiece.onmouseup = (ev: Event) => {
      ev.preventDefault();
      ev.stopPropagation();

      const target = ev as unknown as MouseEvent;
      const down = document.elementsFromPoint(target.clientX, target.clientY);
      const id = down[1].nodeName === "IMG" ? down[2].id : down[1].id;
      const sqr = config.id.indexOf(id);

      clonedPiece.remove();
      if (
        this.state.poss.get(curr) &&
        this.state.poss.get(curr)?.includes(id)
      ) {
        /*Promotion*/
        if (
          (sqr >= 56 || sqr <= 7) &&
          this.state.board[idx].toLowerCase() === "p"
        ) {
          Promotion(curr, id, idx, sqr, this.state, this.dispatch);
          return;
        }
        /*Other Moves Types*/

        if (this.path === "/freemode") {
          let subscribe = stompClientFreemode?.subscribe(
            "/user/queue/freemode/move_status",
            (data: any) => {
              const response = JSON.parse(data.body);
              Move(response, "Free", subscribe);
            }
          );
          FreemodeHandler.Move({ from: curr, to: id, promotion: null });
        } else {
          let subscribe = stompClientMultiplayer?.subscribe(
            `/user/queue/multiplayer/room/${MultiplayerSocket.room}/move_status`,
            (data: any) => {
              const response = JSON.parse(data.body);
              Move(response, "Multi", subscribe);
            }
          );
          MultiplayerSocket.Move({ from: curr, to: id, promotion: null });
        }

        LocalMove(idx, sqr, this.state, this.dispatch);
      } else piece.style.opacity = "1";

      document.removeEventListener("mousemove", onMouseMove);
    };
  }

  /*Handle with click move on tile component*/
  public handleClick(e: React.MouseEvent, id: string) {
    const el = e.target as HTMLDivElement;
    if (!this.state.selected) return;

    const pieceIndex = config.id.indexOf(this.state.selected);
    const enemieIndex = config.id.indexOf(el.id);

    if (
      !this.state.poss.get(this.state.selected) ||
      !this.state.poss.get(this.state.selected)?.includes(id)
    ) {
      this.dispatch({ type: "SETSELECTED", payload: null });
      Styles.Remove();
      return;
    }

    if (
      (enemieIndex >= 56 || enemieIndex <= 7) &&
      this.state.board[pieceIndex].toLowerCase() === "p"
    ) {
      const piece = document
        .getElementById(this.state.selected)
        ?.querySelector(`.${styles.piece}`);
      piece && ((piece as HTMLElement).style.opacity = "0");
      Promotion(
        this.state.selected,
        id,
        enemieIndex,
        pieceIndex,
        this.state,
        this.dispatch
      );
      return;
    }

    if (this.path === "/freemode") {
      let subscribe = stompClientFreemode?.subscribe(
        "/user/queue/freemode/move_status",
        (data: any) => {
          const response = JSON.parse(data.body);
          Move(response, "Free", subscribe);
        }
      );
      FreemodeHandler.Move({
        from: this.state.selected,
        to: id,
        promotion: null,
      });
    } else {
      let subscribe = stompClientMultiplayer?.subscribe(
        `/user/queue/multiplayer/room/${MultiplayerSocket.room}/move_status`,
        (data: any) => {
          const response = JSON.parse(data.body);
          Move(response, "Multi", subscribe);
        }
      );
      MultiplayerSocket.Move({
        from: this.state.selected,
        to: id,
        promotion: null,
      });
    }
    LocalMove(pieceIndex, enemieIndex, this.state, this.dispatch);
  }
}

export default HandleMove;
