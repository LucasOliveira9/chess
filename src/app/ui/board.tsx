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

const Board = () => {
  const { state, dispatch } = useFreemodeContext();
  const [board, setBoard] = useState<{
    position: string[];
    pieceSelected: null | string;
  }>({
    position: config.board,
    pieceSelected: null,
  });
  const [connected, setConnected] = useState<boolean>(false);
  const path = usePathname();

  useEffect(() => {
    if (path === "/freemode" && !connected && !stompClientFreemode?.connected) {
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

    if (!curr) return;
    for (const p of curr) {
      console.log(p);
      const element = document
        .getElementById(p)
        ?.querySelector(`.${tileStyles.bullet}`);
      console.log(element);
      element?.classList.remove(`${tileStyles.none}`);
    }
  }, [state.selected]);

  function Freemode(interval: NodeJS.Timeout) {
    FreemodeHandler.setDispatch(dispatch);
    newGame();
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
            children={<Piece x={x} />}
            state={board}
            setBoard={setBoard}
          />
        ) : (
          <Tile
            id={config.id[index]}
            key={`tile${index}`}
            background={(index + 1) % 2 == 0 ? primary : secondary}
            state={board}
            setBoard={setBoard}
          />
        );
      })}
    </div>
  );
};

export default Board;
