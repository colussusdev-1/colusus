import { useEffect } from "react";

function Webmailer() {
  useEffect(() => {
    window.location.href = "https://business59.web-hosting.com:2096/";
  }, []);

  return <p>Redirecting to webmail...</p>;
}

export default Webmailer;
