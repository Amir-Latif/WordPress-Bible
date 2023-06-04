import BibleSearch from "./components/BibleSearch";
import BibleText from "./components/BibleText";

export default function App() {
  let component = <BibleText />;
  if (wpObject.pageName === "bible_text") {
    component = <BibleText />;
  } else if (wpObject.pageName === "bible_search") {
    component = <BibleSearch />;
  }

  return component;
}
