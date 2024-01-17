"use client";
import { config } from "@/app/lib/chess.config";
import { useEffect, useState } from "react";
import Piece from "./piece";
import Tile from "./tile";
import { useFreemodeContext } from "../lib/context/freemode.context/freemode.provider";
import { newGame, stompClientFreemode } from "../lib/socket";
import FreemodeHandler from "../lib/websocket/Freemode.socket/freemode.handler";
import { usePathname } from "next/navigation";
import tileStyles from "./styles/tile.module.css";
import Styles from "../lib/chess.styles";

const Board = () => {
  const { state, dispatch } = useFreemodeContext();
  const [connected, setConnected] = useState<boolean>(false);
  const path = usePathname();

  useEffect(() => {
    if (path === "/freemode" && !connected) {
      const interval: NodeJS.Timeout = setInterval(() => {
        if (stompClientFreemode?.connected) {
          Freemode(interval);
        }
      }, 100);
    } else null;
  }, []);

  useEffect(() => {
    if (!state.selected) return;
    const curr: string[] | undefined = state.poss.get(state.selected);
    const selected = document
      .getElementById(state.selected)
      ?.querySelector("img");
    const enPassant =
      state.fen && state.fen.split(" ")[3].length == 2
        ? state.fen.split(" ")[3]
        : null;
    const idx = config.id.indexOf(state.selected);

    if (!curr || !selected) return;

    for (const p of curr) {
      const element = document
        .getElementById(p)
        ?.querySelector(`.${tileStyles.bullet}`);
      const enemie = document
        .getElementById(p)
        ?.querySelector(`.${tileStyles.piece}`);

      /*En Passant danger logic*/
      if (
        state.board[idx].toLowerCase() === "p" &&
        enPassant &&
        enPassant.slice(0, 1) === p.slice(0, 1) &&
        state.selected.slice(0, 1) !== p.slice(0, 1)
      ) {
        if (
          +enPassant.slice(1) === +p.slice(1) + 1 ||
          +enPassant.slice(1) === +p.slice(1) - 1
        ) {
          const enemie = document
            .getElementById(enPassant)
            ?.querySelector(`.${tileStyles.piece}`);
          enemie &&
          selected.getAttribute("data-alliance") !==
            enemie.getAttribute("data-alliance")
            ? document
                .getElementById(enPassant)
                ?.classList.add(tileStyles.danger)
            : null;
        }
      }
      /* */

      if (
        enemie &&
        selected.getAttribute("data-alliance") ===
          enemie.getAttribute("data-alliance")
      )
        Styles.Selected(p);
      else if (
        enemie &&
        selected.getAttribute("data-alliance") !==
          enemie.getAttribute("data-alliance")
      )
        document.getElementById(p)?.classList.add(tileStyles.danger);
      else element?.classList.remove(tileStyles.none);
    }
  }, [state.selected]);

  function Freemode(interval: NodeJS.Timeout) {
    FreemodeHandler.setDispatch(dispatch);
    const id = localStorage.getItem("freemode");
    newGame(id);
    setConnected(true);
    clearInterval(interval);
  }

  let row = 1;
  return (
    <div
      style={{
        display: "flex",
        maxWidth: "40em",
        width: "100%",
        flexWrap: "wrap",
        overflow: "auto",
        border: "3px outset green",
      }}
    >
      {state.board.map((x: string, index: number) => {
        let primary = "",
          secondary = "";
        if (row % 2 === 0)
          (primary = "rgb(214,118,9)"), (secondary = "rgb(134,46,5)");
        else (primary = "rgb(134,46,5)"), (secondary = "rgb(214,118,9)");

        if ((index + 1) % 8 == 0) row++;

        return x !== "e" ? (
          <Tile
            id={config.id[index]}
            key={`tile${index}`}
            background={(index + 1) % 2 == 0 ? primary : secondary}
            children={<Piece type={x} />}
          />
        ) : (
          <Tile
            id={config.id[index]}
            key={`tile${index}`}
            background={(index + 1) % 2 == 0 ? primary : secondary}
          />
        );
      })}
    </div>
  );
};

export default Board;
