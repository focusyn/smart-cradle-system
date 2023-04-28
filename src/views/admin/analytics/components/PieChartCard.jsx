import Card from "~/components/card";
import Iframe from "react-iframe";

const PieChartCard = () => {
  return (
    <Card extra="rounded-[20px] p-3">
      <div className="flex flex-row justify-between px-3 pt-2">
        <div>
          <h4 className="text-lg font-bold text-navy-700 dark:text-white">
            Camera Feed
          </h4>
        </div>
      </div>

      <div className="hideScroll mb-auto flex h-[220px] w-full items-center justify-center">
        <Iframe
          url="https://server.biospheredev.me/client"
          id=""
          width="100%"
          height="100%"
          className="overflow-hidden rounded-xl"
          position="relative"
        />
      </div>
    </Card>
  );
};

export default PieChartCard;
