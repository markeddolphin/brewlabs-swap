import { useEffect, useState } from "react";

const useCountdown = (targetDate) => {
  const countDownDate = targetDate * 1000;

  const [countDown, setCountDown] = useState(countDownDate - Date.now() > 0 ? countDownDate - Date.now() : 0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (countDownDate - Date.now() < 0) {
        setCountDown(0);
        clearInterval(interval);
        return;
      }
      setCountDown(countDownDate - Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDate]);

  return getReturnValues(countDown);
};

const getReturnValues = (countDown) => {
  const _time = Math.floor(countDown / 1000);
  // calculate time left
  const days = Math.floor(_time / (3600 * 24));
  const hours = Math.floor((_time % 86400) / 3600);
  const minutes = Math.floor((_time % 3600) / 60);
  const seconds = Math.floor(_time % 60);

  return [days, hours, minutes, seconds];
};

export { useCountdown };
