import { config } from "../../../lib/chess/chess.config";
import Image from "next/image";
import styles from "../../styles/tile/index.module.scss";
import { usePathname } from "next/navigation";
import { useContext } from "@/app/lib/context/context";
import HandleMove from "@/app/lib/chess/chess.move.handlemove";

const Tile = ({
  children,
  id,
  background,
}: {
  children?: React.ReactNode;
  id: string;
  background: string;
}) => {
  const path = usePathname();
  const { state, dispatch } = useContext(path);
  const handleMove = new HandleMove(state, dispatch, path);

  const classWhite =
    +id.slice(0, 1) === 1 ? styles.whitePromotion : styles.blackPromotion;
  const classBlack =
    +id.slice(0, 1) === 8 ? styles.blackPromotion : styles.whitePromotion;

  return (
    <div
      id={id}
      style={{ backgroundColor: background }}
      className={styles.tile}
      onClick={(e) => handleMove.handleClick(e, id)}
    >
      <div className={`${styles.none} ${styles.bullet}`}></div>
      {children}
      {(+id.slice(-1) === 1 || +id.slice(-1) === 8) && (
        <div
          className={`${+id.slice(-1) === 1 ? classWhite : classBlack} ${
            styles.promotion
          } ${styles.none} `}
        >
          <Image
            src={
              +id.slice(-1) === 1
                ? `/images/BlackQueen.png`
                : "/images/WhiteQueen.png"
            }
            className={styles.promotionImg}
            alt=""
            data-type={+id.slice(-1) === 1 ? `q` : "Q"}
            width={55}
            height={50}
            placeholder="blur"
            blurDataURL={`/images/${
              config.image[
                +id.slice(-1) === 1 ? `q` : ("Q" as keyof typeof config.image)
              ]
            }`}
          />
          <Image
            src={
              +id.slice(-1) === 1
                ? `/images/BlackRook.png`
                : "/images/WhiteRook.png"
            }
            className={styles.promotionImg}
            alt=""
            data-type={+id.slice(-1) === 1 ? `r` : "R"}
            width={55}
            height={50}
            placeholder="blur"
            blurDataURL={`/images/${
              config.image[
                +id.slice(-1) === 1 ? `r` : ("R" as keyof typeof config.image)
              ]
            }`}
          />
          <Image
            src={
              +id.slice(-1) === 1
                ? `/images/BlackBishop.png`
                : "/images/WhiteBishop.png"
            }
            className={styles.promotionImg}
            alt=""
            data-type={+id.slice(-1) === 1 ? `b` : "B"}
            width={55}
            height={50}
            placeholder="blur"
            blurDataURL={`/images/${
              config.image[
                +id.slice(-1) === 1 ? `b` : ("B" as keyof typeof config.image)
              ]
            }`}
          />
          <Image
            src={
              +id.slice(-1) === 1
                ? `/images/BlackKnight.png`
                : "/images/WhiteKnight.png"
            }
            className={styles.promotionImg}
            alt=""
            data-type={+id.slice(-1) === 1 ? `n` : "N"}
            width={55}
            height={50}
            placeholder="blur"
            blurDataURL={`/images/${
              config.image[
                +id.slice(-1) === 1 ? `n` : ("N" as keyof typeof config.image)
              ]
            }`}
          />
        </div>
      )}
    </div>
  );
};

export default Tile;
