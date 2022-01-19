import Styles from "./SmallText.module.css";

export function SmallText({ children, className = "" }) {
  return <span className={`${Styles.text} ${className}`}>{children}</span>;
}
