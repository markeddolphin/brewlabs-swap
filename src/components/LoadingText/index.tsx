import { useEffect, useState } from "react";

const LoadingText = ({ text }) => {
  const [dotCount, setDotCount] = useState([]);
  useEffect(() => {
    setInterval(() => {
      let temp = [];
      for (let i = 0; i < Math.floor(Date.now() / 1000) % 4; i++) temp.push(i);
      setDotCount(temp);
    }, 1000);
  }, []);
  return (
    <div>
      {text}
      {dotCount.map(() => {
        return ".";
      })}
    </div>
  );
};

export default LoadingText;
