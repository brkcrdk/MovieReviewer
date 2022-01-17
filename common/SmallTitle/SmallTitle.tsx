import Styles from "./SmallTitle.module.css";

export function SmallTitle({ children, className = "" }) {
  return <h1 className={`${Styles.title} ${className}`}>{children}</h1>;
}
