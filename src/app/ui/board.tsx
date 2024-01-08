"use client";
import { config } from "@/app/lib/chess.config";
import Image from "next/image";
import { MouseEvent, useState } from "react";

const tileStyle = {
  height: "5em",
  width: "100%",
  flex: "0 0 calc(12.5%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const Board = () => {
  const [board, setBoard] = useState<string[]>(config.board);
  const handleMouseDown = (e: MouseEvent<HTMLImageElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const piece = e.target as HTMLImageElement;
    const curr = piece?.parentElement?.id;

    if (!curr || !piece || e.buttons !== 1) return;
    const idx = config.id.indexOf(curr);

    let x = e.clientX - piece.getBoundingClientRect().left;
    let y = e.clientY - piece.getBoundingClientRect().top;

    piece.style.zIndex = "1000";
    piece.style.position = "absolute";
    piece.style.cursor = "grabbing";

    const width = piece.style.width;
    const height = piece.style.height;

    document.body.append(piece);

    piece.style.width = width;
    piece.style.height = height;

    const MoveAt = (px: number, py: number) => {
      const moveX = px - x,
        moveY = py - y;

      piece.style.left = `${moveX}px`;
      piece.style.top = `${moveY}px`;
    };

    MoveAt(e.pageX, e.pageY);

    const onMouseMove = (event: Event) => {
      event.preventDefault();
      const target = event as unknown as MouseEvent;

      MoveAt(target.pageX, target.pageY);
    };

    document.addEventListener("mousemove", onMouseMove);

    piece.onmouseup = (ev: Event) => {
      ev.preventDefault();
      ev.stopPropagation();

      const target = ev as unknown as MouseEvent;
      const down = document.elementsFromPoint(target.clientX, target.clientY);
      const id = down[1].nodeName === "IMG" ? down[2].id : down[1].id;
      const sqr = config.id.indexOf(id);

      if (idx !== sqr) {
        const last = board[idx];
        board[idx] = "e";
        const newBoard = [...board];
        newBoard[sqr] = last;
        setBoard(newBoard);
        console.log(idx + " " + board);
      }

      if (document.body.contains(piece)) {
        document.body.removeChild(piece);
        document.removeEventListener("mousemove", onMouseMove);
        piece.onmouseup = null;
      }
    };
  };
  let row = 1;
  return (
    <div
      style={{
        display: "flex",
        maxWidth: "50em",
        width: "100%",
        flexWrap: "wrap",
        overflow: "auto",
        border: "3px onset green",
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
            key={`obj${config.id[index]}`}
            style={{
              ...tileStyle,
              backgroundColor: `${(index + 1) % 2 === 0 ? primary : secondary}`,
            }}
          >
            {/*config.board[index]*/}
            {x !== "e" && (
              <Image
                src={`/images/${config.image[x as keyof typeof config.image]}`}
                alt=""
                width={55}
                height={50}
                style={{ cursor: "grab" }}
                onMouseDown={handleMouseDown}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Board;
