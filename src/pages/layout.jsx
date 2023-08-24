import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import "../styles/slb-styles.scss";

export default function RootLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return <div className="slb-app">{isLoading ? <Spinner /> : children}</div>;
}
