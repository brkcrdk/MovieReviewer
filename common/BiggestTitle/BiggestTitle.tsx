import Styles from "./BiggestTitle.module.scss";

export function BiggestTitle({ children }) {
  return <h1 className={Styles.title}>{children}</h1>;
}
