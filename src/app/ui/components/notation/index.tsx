"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import styles from "@/app/ui/styles/notation/index.module.scss";
import { useContext } from "@/app/lib/context/context";

const Notation = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const path = usePathname();
  const { state, dispatch } = useContext(path);

  useEffect(() => {
    const element = containerRef.current;
    element &&
      (element.scrollTop = element?.scrollHeight - element.clientHeight);
  }, [state.notation]);

  let idx = 1;

  return (
    <div id={`notation${path}`} className={styles.notation} ref={containerRef}>
      <div className={styles.notation__container}>
        {state.notation.map((x, i) => {
          let className =
            (i + 1) % 2 === 0 ? `${styles.span__end}` : `${styles.span__start}`;
          const currBoard = structuredClone(state.history);

          if ((i + 1) % 2 !== 0) {
            return (
              <div key={`not${i}`} className={className}>
                <span className={styles.span__number}>{idx}.</span>
                <span
                  className={className}
                  onClick={() => {
                    if (!currBoard) return;
                    dispatch({
                      type: "SETBOARD",
                      payload: currBoard[i],
                    });
                    dispatch({ type: "RESTARTBOARD" });
                  }}
                >
                  {x}
                </span>
              </div>
            );
          } else {
            idx++;
            return (
              <span
                key={`not${i}`}
                className={className}
                onClick={() => {
                  if (!currBoard) return;
                  dispatch({
                    type: "SETBOARD",
                    payload: currBoard[i],
                  });
                  dispatch({ type: "RESTARTBOARD" });
                }}
              >
                {x}
              </span>
            );
          }
        })}
      </div>
    </div>
  );
};

export default Notation;
