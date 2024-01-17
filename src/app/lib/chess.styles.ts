import styles from "../ui/styles/tile.module.css";

class Styles {
  public static Selected(id: string) {
    const Element = document.getElementById(id);
    if (!Element) return;
    Element.classList.add(styles.selected);
  }

  public static Remove() {
    const Elements = document.querySelectorAll(`.${styles.tile}`);
    if (!Elements) return;

    for (const element of Elements) {
      element.classList.remove(styles.selected);
      element.classList.remove(styles.danger);

      element
        .querySelector(`.${styles.bullet}`)
        ?.classList.add(`${styles.none}`);

      const promotion = element.querySelectorAll(`.${styles.promotion}`);
      if (!promotion) return;
      for (const p of promotion) p.classList.add(styles.none);

      const piece = element.querySelector(`.${styles.piece}`);
      piece && ((piece as HTMLElement).style.opacity = "1");
    }
  }
}

export default Styles;
