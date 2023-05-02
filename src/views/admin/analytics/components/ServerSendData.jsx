import { useEffect, useState } from "react";
import RealtimeChart from "./RealtimeChart";

const ServerSendData = ({ weight, avgWeight }) => {
  const [data, updateData] = useState([1, 2, 3]);

  useEffect(() => {
    const interval = setInterval(() => {
      const val = Math.round(avgWeight * 100) / 100;
      let array = [...data, val];
      array.shift();
      updateData(array);
    }, 3000);
    return () => {
      window.clearInterval(interval);
    };
  }, [data, avgWeight]); // pass the data as a dependency (because you are using it inside the effect)

  return <RealtimeChart data={data} weight={weight} />;
};

export default ServerSendData;
