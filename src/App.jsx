import React, { useState, useEffect } from "react";
import BibleSearch from "./components/BibleSearch";
import BibleText from "./components/BibleText";
import Spinner from "./components/Spinner";
import "./styles/amb-styles.scss";

const pageName = decodeURIComponent(wpObject.pageName)

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
    if (pageName === "الكتاب-المقدس") {
      component = <BibleText />;
    } else if (pageName === "بحث-في-الكتاب-المقدس") {
      component = <BibleSearch />;
    }
  }
  return <div className="amb-app">{component}</div>;
}
