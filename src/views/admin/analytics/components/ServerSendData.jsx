import { useEffect, useState } from "react";
import RealtimeChart from "./RealtimeChart";

const FiciGame = () => {
  const [data, updateData] = useState([1, 2, 3]);

  useEffect(() => {
    const interval = setInterval(() => {
      const val = Math.floor(Math.random() * (100 - 30 + 1)) + 30;
      let array = [...data, val];
      array.shift();
      updateData(array);
    }, 3000);
    return () => {
      window.clearInterval(interval);
    };
  }, [data]); // pass the data as a dependency (because you are using it inside the effect)

  return <RealtimeChart data={data} />;
};

export default FiciGame;
