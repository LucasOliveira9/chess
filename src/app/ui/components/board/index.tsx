"use client";
import { config } from "@/app/lib/chess/chess.config";
import { useEffect } from "react";
import Piece from "@/app/ui/components/piece";
import Tile from "@/app/ui/components/tile";
import Captured from "../captured_pieces";

import { usePathname } from "next/navigation";
import Styles from "@/app/lib/chess/chess.styles";

import tileStyles from "@/app/ui/styles/tile/index.module.scss";
import styles from "@/app/ui/styles/board/index.module.scss";
import { useContext } from "@/app/lib/context/context";

const Board = () => {
  const path = usePathname();
  const { state } = useContext(path);

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

  let row = 1;
  return (
    <>
      <div id="blackCapture" className={styles.captured}>
        <Captured color="white" piece="P" />
        <Captured color="white" piece="B" />
        <Captured color="white" piece="N" />
        <Captured color="white" piece="R" />
        <Captured color="white" piece="Q" />
      </div>
      <div
        style={{
          display: "flex",
          maxWidth: "40em",
          width: "100%",
          flexWrap: "wrap",
          overflow: "auto",
          border: "3px outset rgb(134, 46, 5)",
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
      <div id="whiteCapture" className={styles.captured}>
        <Captured color="black" piece="p" />
        <Captured color="black" piece="b" />
        <Captured color="black" piece="n" />
        <Captured color="black" piece="r" />
        <Captured color="black" piece="q" />
      </div>
    </>
  );
};

export default Board;
