import React from "react";
import SpSt from "../styles/spinner.module.scss";

export default function Spinner() {
  return (
    <div className={SpSt.spinnerContainer}>
      <div className={SpSt.spinner}>
        <div className={SpSt.bounce1}></div>
        <div className={SpSt.bounce2}></div>
        <div className={SpSt.bounce3}></div>
      </div>
    </div>
  );
}
