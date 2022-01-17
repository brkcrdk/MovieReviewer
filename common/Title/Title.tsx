import { useState } from "react";
import Styles from "./Title.module.css";

export function Title({ children }) {
  return <h1 className={Styles.title}>{children}</h1>;
}
