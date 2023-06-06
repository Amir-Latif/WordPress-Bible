import BibleSearch from "./components/BibleSearch";
import BibleText from "./components/BibleText";
import "./styles/amb-styles.css"

export default function App() {

  let component = <BibleText />;
  if (wpObject.pageName === "bible-text") {
    component = <BibleText />;
  } else if (wpObject.pageName === "bible-search") {
    component = <BibleSearch />;
  }

  return component;
}
