"use client";

import Image from "next/image";
import { config } from "@/app/lib/chess/chess.config";
import React from "react";
import { usePathname } from "next/navigation";
import { useContext } from "@/app/lib/context/context";
import HandleMove from "@/app/lib/chess/chess.move.handlemove";
import tileStyles from "../../styles/tile/index.module.scss";

const Piece = ({ type }: { type: string }) => {
  const path = usePathname();
  const { state, dispatch } = useContext(path);
  const handleMove = new HandleMove(state, dispatch, path);

  return (
    <Image
      src={`/images/${config.image[type as keyof typeof config.image]}`}
      alt=""
      width={55}
      height={50}
      draggable="false"
      onMouseDown={(e) => handleMove.handleMouseDown(e)}
      className={tileStyles.piece}
      data-alliance={type.toLowerCase() === type ? "b" : "w"}
      data-type={type}
      blurDataURL={`/images/${config.image[type as keyof typeof config.image]}`}
    />
  );
};

export default Piece;
