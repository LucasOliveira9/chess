"use client";

import Image from "next/image";
import { config } from "@/app/lib/chess.config";
import React from "react";
import Styles from "../lib/chess.styles";
import { useFreemodeContext } from "../lib/context/freemode.context/freemode.provider";
import FreemodeHandler from "../lib/websocket/Freemode.socket/freemode.handler";
import { stompClientFreemode } from "../lib/socket";
import Move from "../lib/utils/move";

const Piece = ({ x }: { x: string }) => {
  const { state, dispatch } = useFreemodeContext();
  const handleMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const piece = e.target as HTMLImageElement;
    const clonedPiece = piece.cloneNode(false) as HTMLImageElement;

    const curr = piece?.parentElement?.id;

    if (!curr || !clonedPiece || !piece || e.buttons !== 1) return;
    Styles.Selected(curr);
    dispatch({ type: "SETSELECTED", payload: curr });
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
      const pieceAlliance = document
        .getElementById(curr)
        ?.querySelector("img")
        ?.getAttribute("data-alliance");
      const enemieAlliance = document
        .getElementById(id)
        ?.querySelector("img")
        ?.getAttribute("data-alliance");

      clonedPiece.remove();
      if (
        state.poss.get(curr) &&
        state.poss.get(curr)?.includes(id) &&
        idx !== -1 &&
        sqr !== -1 &&
        pieceAlliance !== enemieAlliance
      ) {
        let subscribe = stompClientFreemode?.subscribe(
          "/user/queue/freemode/move_status",
          (data: any) => {
            const response = JSON.parse(data.body);
            Move(idx, sqr, null, response, "Free", subscribe);
          }
        );
        FreemodeHandler.Move({ from: curr, to: id, promotion: null });
        const last = state.board[idx];
        state.board[idx] = "e";
        const newBoard = [...state.board];
        newBoard[sqr] = last;

        dispatch({ type: "SETBOARD", payload: newBoard });
        dispatch({ type: "SETSELECTED", payload: null });
      } else {
        piece.style.opacity = "1";
      }

      document.removeEventListener("mousemove", onMouseMove);
    };
  };
  return (
    <Image
      src={`/images/${config.image[x as keyof typeof config.image]}`}
      alt=""
      width={55}
      height={50}
      style={{ cursor: "grab", userSelect: "none" }}
      draggable="false"
      onMouseDown={handleMouseDown}
      data-alliance={x.toLowerCase() === x ? "b" : "w"}
    />
  );
};

export default Piece;
