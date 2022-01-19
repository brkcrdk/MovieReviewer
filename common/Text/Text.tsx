import Styles from "./Text.module.css";

export function Text({ children, className = "" }) {
  return <span className={`${Styles.text} ${className}`}>{children}</span>;
}
