import { useState } from "react";
import Styles from "./Title.module.css";

export function Title({ children, className = "" }) {
  return <h1 className={`${Styles.title} ${className}`}>{children}</h1>;
}
