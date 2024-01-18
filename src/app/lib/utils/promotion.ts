import tileStyles from "@/app/ui/styles/tile/index.module.scss";
import {
  IState,
  TAction,
} from "../context/freemode.context/freemode.interface";
import { stompClientFreemode } from "../socket/socket";
import FreemodeHandler from "../websocket/Freemode.socket/freemode.handler";
import Move from "./move";

const Promotion = (
  from: string,
  to: string,
  idx: number,
  sqr: number,
  state: IState,
  dispatch: React.Dispatch<TAction>
) => {
  const promotion = document
    .getElementById(to)
    ?.querySelector(`.${tileStyles.promotion}`);

  const img = promotion?.querySelectorAll("img");

  if (!img || !promotion) return false;

  for (const i of img) {
    i.addEventListener(
      "click",
      function Promotion(e) {
        e.stopPropagation();
        const value = this.getAttribute("data-type");

        if (!from || !to || !value) return;
        let subscribe = stompClientFreemode?.subscribe(
          "/user/queue/freemode/move_status",
          (data: any) => {
            const response = JSON.parse(data.body);
            Move(response, "Free", subscribe);
          }
        );
        FreemodeHandler.Move({ from, to, promotion: value });

        const newBoard = [...state.board];
        newBoard[idx] = "e";
        newBoard[sqr] = value;

        dispatch({ type: "SETBOARD", payload: newBoard });
        dispatch({ type: "SETSELECTED", payload: null });
        dispatch({ type: "SETPOSS", payload: new Map() });

        this.removeEventListener("click", Promotion);

        this.parentElement && this.parentElement.classList.add(tileStyles.none);
      },
      false
    );
  }

  promotion.classList.remove(tileStyles.none);
};

export default Promotion;
