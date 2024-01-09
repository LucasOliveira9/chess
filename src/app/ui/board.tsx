"use client";
import { config } from "@/app/lib/chess.config";
import { useState } from "react";
import Piece from "./piece";
import Tile from "./tile";

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

        return x !== "e" ? (
          <Tile
            id={config.id[index]}
            key={`tile${index}`}
            background={(index + 1) % 2 == 0 ? primary : secondary}
            children={<Piece board={board} setBoard={setBoard} x={x} />}
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
