import { useEffect, useState } from "react";

function getCurrentDateTime() {
  const now = new Date();

  return {
    date: new Intl.DateTimeFormat(undefined, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(now),

    time: new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(now),

    seconds: now.getSeconds(),
    now,
  };
}

export default function useLiveTime() {
  const [liveTime, setLiveTime] = useState(getCurrentDateTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTime(getCurrentDateTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return liveTime;
}
