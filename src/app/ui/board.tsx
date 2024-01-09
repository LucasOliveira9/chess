"use client";
import { config } from "@/app/lib/chess.config";
import Image from "next/image";
import { useState } from "react";
import Piece from "./piece";

import styles from "./styles/board.module.css";

const tileStyle = {
  height: "4.5em",
  width: "100%",
  flex: "0 0 calc(12.5%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const Board = () => {
  const [board, setBoard] = useState<string[]>(config.board);

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
      {board.map((x: string, index: number) => {
        let primary = "",
          secondary = "";
        if (row % 2 === 0)
          (primary = "rgb(214,118,9)"), (secondary = "rgb(134,46,5)");
        else (primary = "rgb(134,46,5)"), (secondary = "rgb(214,118,9)");

        if ((index + 1) % 8 == 0) row++;

        return (
          <div
            id={config.id[index]}
            className={`square`}
            key={`obj${config.id[index]}`}
            style={{
              ...tileStyle,
              backgroundColor: `${(index + 1) % 2 === 0 ? primary : secondary}`,
            }}
          >
            {/*config.board[index]*/}
            {x !== "e" && <Piece board={board} setBoard={setBoard} x={x} />}
          </div>
        );
      })}
    </div>
  );
};

export default Board;
