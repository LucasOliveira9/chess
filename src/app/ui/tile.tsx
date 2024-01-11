import { config } from "../lib/chess.config";
import styles from "./styles/tile.module.css";

const tileStyle = {
  height: "4.5em",
  width: "100%",
  flex: "0 0 calc(12.5%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const Tile = ({
  children,
  id,
  background,
  state,
  setBoard,
}: {
  children?: React.ReactNode;
  id: string;
  background: string;
  state: {
    position: string[];
    pieceSelected: null | string;
  };
  setBoard: React.Dispatch<
    React.SetStateAction<{ position: string[]; pieceSelected: null | string }>
  >;
}) => {
  const handleClick = (e: React.MouseEvent) => {
    const el = e.target as HTMLDivElement;
    if (!state.pieceSelected) return;
    const piece = document
      .getElementById(state.pieceSelected)
      ?.querySelector("img");
    const enemie = document.getElementById(el.id)?.querySelector("img");
    const pieceIndex = config.id.indexOf(state.pieceSelected);
    const enemieIndex = config.id.indexOf(el.id);

    if (
      enemie &&
      piece?.getAttribute("data-alliance") ===
        enemie.getAttribute("data-alliance")
    )
      return;

    state.position[enemieIndex] = state.position[pieceIndex];
    state.position[pieceIndex] = "e";
    const newBoard = [...state.position];
    setBoard((state) => {
      return {
        ...state,
        position: newBoard,
        pieceSelected: null,
      };
    });
  };
  return (
    <div
      id={id}
      style={{ ...tileStyle, backgroundColor: background }}
      className={`tile`}
      onClick={handleClick}
    >
      <div className={`${styles.none} ${styles.bullet}`}></div>
      {children}
    </div>
  );
};

export default Tile;
