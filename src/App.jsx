import React, { useState, useEffect } from "react";
import BibleSearch from "./pages/BibleSearch";
import BibleText from "./pages/BibleText";

const pageName = ambBuildObject.pageName;

export default function App() {
  const [component, setComponent] = useState(<></>);

  useEffect(() => {
    setComponent(
      pageName === "الكتاب-المقدس" ? <BibleText /> : <BibleSearch />
    );
  }, []);

  return <div className="amb-app">{component}</div>;
}
