import Styles from "./Text.module.css";

export function Text({ children }) {
  return <span className={Styles.text}>{children}</span>;
}
