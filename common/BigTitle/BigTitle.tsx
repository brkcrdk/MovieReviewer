import Styles from "./BigTitle.module.css";

export function BigTitle({ children, className = "" }) {
  return <h1 className={`${Styles.title} ${className}`}>{children}</h1>;
}
