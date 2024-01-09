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
}: {
  children?: React.ReactNode;
  id: string;
  background: string;
}) => {
  return (
    <div
      id={id}
      style={{ ...tileStyle, backgroundColor: background }}
      className={`tile`}
    >
      {children}
    </div>
  );
};

export default Tile;
