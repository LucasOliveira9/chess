"use client";

import { useFreemodeContext } from "@/app/lib/context/freemode.context/freemode.provider";
import styles from "@/app/ui/styles/fen/index.module.scss";

const Fen = () => {
  const { state } = useFreemodeContext();
  return (
    <div className={styles.main}>
      <span>{state.fen}</span>
    </div>
  );
};

export default Fen;
