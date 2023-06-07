import React, { useState, useEffect } from "react";
import BibleSearch from "./components/BibleSearch";
import BibleText from "./components/BibleText";
import Spinner from "./components/Spinner";
import "./styles/amb-styles.css";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    window.addEventListener("load", () => setIsLoading(false));

    return () => {
      window.addEventListener("load");
    };
  }, []);

  let component = <Spinner />;

  if (!isLoading) {
    if (wpObject.pageName === "bible-text") {
      component = <BibleText />;
    } else if (wpObject.pageName === "bible-search") {
      component = <BibleSearch />;
    }
  }
  return component;
}
