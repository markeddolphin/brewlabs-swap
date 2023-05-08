/* eslint-disable react-hooks/exhaustive-deps */

import { useCountdown } from "hooks/useCountdown";
import { useEffect, useState } from "react";

const CountDown = ({ time, onWithdraw }: { time: number; onWithdraw: any }) => {
  const [timeText, setTimeText] = useState("");

  const [days, hours, minutes, seconds] = useCountdown(time);
  useEffect(() => {
    if (days + hours + minutes + seconds === 0) {
      setTimeText("Unlocked");
      return;
    }
    setTimeText(
      days +
        ":" +
        hours.toString().padStart(2, "0") +
        ":" +
        minutes.toString().padStart(2, "0") +
        ":" +
        seconds.toString().padStart(2, "0")
    );
  }, [days, hours, minutes, seconds]);

  return (
    <>
      <div className="cursor-pointer leading-none" onClick={() => (timeText === "Unlocked" ? onWithdraw() : {})}>
        {timeText}
      </div>
      <div className="leading-none">{timeText === "Unlocked" ? "" : "Remaining"}</div>
    </>
  );
};

export default CountDown;
