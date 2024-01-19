"use client";

import Image from "next/image";
import { config } from "@/app/lib/chess/chess.config";
import React from "react";
import Styles from "@/app/lib/chess/chess.styles";
import FreemodeHandler from "@/app/lib/websocket/freemode.socket/freemode.handler";
import {
  stompClientFreemode,
  stompClientMultiplayer,
} from "@/app/lib/socket/socket";
import Move from "@/app/lib/utils/move";
import Promotion from "@/app/lib/utils/promotion";

import tileStyles from "../../styles/tile/index.module.scss";
import LocalMove from "@/app/lib/utils/move.local";
import { usePathname } from "next/navigation";
import { useContext } from "@/app/lib/context/context";
import MultiplayerSocket from "@/app/lib/websocket/multiplayer.socket/multiplayer.socket";

const Piece = ({ type }: { type: string }) => {
  const path = usePathname();
  console.log(path);
  const { state, dispatch } = useContext(path);

  const handleMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const piece = e.target as HTMLImageElement;
    const clonedPiece = piece.cloneNode(false) as HTMLImageElement;

    const curr = piece?.parentElement?.id;

    if (!curr || !clonedPiece || !piece || e.buttons !== 1) return;

    if (curr !== state.selected) Styles.Remove();
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

      clonedPiece.remove();
      if (state.poss.get(curr) && state.poss.get(curr)?.includes(id)) {
        /*Promotion*/
        if ((sqr >= 56 || sqr <= 7) && state.board[idx].toLowerCase() === "p") {
          Promotion(curr, id, idx, sqr, state, dispatch);
          return;
        }
        /*Other Moves Types*/

        if (path === "/freemode") {
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
              Move(response, "Free", subscribe);
            }
          );
          MultiplayerSocket.Move({ from: curr, to: id, promotion: null });
        }

        LocalMove(idx, sqr, state, dispatch);
      } else piece.style.opacity = "1";

      document.removeEventListener("mousemove", onMouseMove);
    };
  };
  return (
    <Image
      src={`/images/${config.image[type as keyof typeof config.image]}`}
      alt=""
      width={55}
      height={50}
      draggable="false"
      onMouseDown={handleMouseDown}
      className={tileStyles.piece}
      data-alliance={type.toLowerCase() === type ? "b" : "w"}
      data-type={type}
      blurDataURL={`/images/${config.image[type as keyof typeof config.image]}`}
    />
  );
};

export default Piece;
