"use client";

import { config } from "@/app/lib/chess/chess.config";
import { useContext } from "@/app/lib/context/context";
import styles from "@/app/ui/styles/captured_pieces/index.module.scss";
import Image from "next/image";
import { usePathname } from "next/navigation";

const CapturedPieces = ({
  color,
  piece,
}: {
  color: "white" | "black";
  piece: string;
}) => {
  const path = usePathname();
  const { state, dispatch } = useContext(path);

  const pieces = {
    p: "Pawn",
    b: "Bishop",
    r: "Rook",
    n: "Knight",
    q: "Queen",
  };

  const pieceColor = color.charAt(0).toUpperCase() + color.slice(1);
  return (
    <main
      className={styles.captured}
      style={{
        display: state.captured.filter((x) => x === piece).length
          ? "flex"
          : "none",
      }}
    >
      <div>
        {state.captured
          .filter((x) => x === piece)
          .map((_, i) => {
            if (i > 7 && piece.toLowerCase() === "p") return;
            else if (i > 2 && piece.toLowerCase() !== "p") return;

            return (
              <Image
                src={`/images/${pieceColor}${
                  pieces[piece.toLowerCase() as keyof typeof pieces]
                }.png`}
                alt={`${pieceColor} ${
                  pieces[piece.toLowerCase() as keyof typeof pieces]
                } piece`}
                width={20}
                height={20}
                key={`${piece}t${i}`}
                blurDataURL={`/images/${
                  config.image[piece as keyof typeof config.image]
                }`}
              />
            );
          })}
      </div>
    </main>
  );
};

export default CapturedPieces;
