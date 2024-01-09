import styles from "../ui/styles/board.module.css";

class Styles {
  public static Selected(id: string) {
    const Element = document.getElementById(id);
    if (!Element) return;
    Styles.Remove();
    Element.classList.add(styles.selected);
  }

  public static Remove() {
    const Elements = document.querySelectorAll(".square");
    if (!Elements) return;

    Elements.forEach((element) => {
      element.classList.remove(styles.selected);
    });
  }
}

export default Styles;
