import Styles from "./BigTitle.module.css";

export function BigTitle({ children }) {
  return <h1 className={Styles.title}>{children}</h1>;
}
