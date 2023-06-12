import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import "../styles/amb-styles.scss";

export default function RootLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return <div className="amb-app">{isLoading ? <Spinner /> : children}</div>;
}
