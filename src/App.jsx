import React, { useState, useEffect } from "react";
import BibleSearch from "./pages/BibleSearch";
import BibleText from "./pages/BibleText";
import Spinner from "./components/Spinner";

const pageName = ambBuildObject.pageName

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
   setIsLoading(false)

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