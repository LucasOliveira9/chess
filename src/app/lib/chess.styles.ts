import styles from "../ui/styles/tile.module.css";

class Styles {
  public static Selected(id: string) {
    const Element = document.getElementById(id);
    if (!Element) return;
    Element.classList.add(styles.selected);
  }

  public static Remove() {
    const Elements = document.querySelectorAll(".tile");
    if (!Elements) return;

    Elements.forEach((element) => {
      element.classList.remove(styles.selected);
      element.classList.remove(styles.danger);
      element
        .querySelector(`.${styles.bullet}`)
        ?.classList.add(`${styles.none}`);
    });
  }
}

export default Styles;
