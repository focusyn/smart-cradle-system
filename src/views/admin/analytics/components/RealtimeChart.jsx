import React from "react";
import Chart from "react-apexcharts";
import Card from "~/components/card";

export default function ReactimeChart(props) {
  const series = [
    {
      name: "Weight",
      data: props.data,
    },
  ];
  const options = {
    chart: {
      height: 350,
      type: "area",
      zoom: {
        enabled: true,
      },
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 2,
      curve: "smooth",
    },
    animations: {
      enabled: true,
      easing: "linear",
      dynamicAnimation: {
        speed: 1000,
      },
    },
    xaxis: {
      labels: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        formatter: (val) => val + "g",
      },
    },

    colors: ["#6AD2FF"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: true,
        gradientToColors: ["#4318FF"],
        opacityFrom: 1,
        opacityTo: 1,
        type: "vertical",
        stops: [0, 30],
      },
    },
  };
  return (
    <Card extra="rounded-[20px] p-3">
      <div className="flex flex-row justify-between px-3 pt-2">
        <div>
          <h4 className="text-lg font-bold text-navy-700 dark:text-white">
            Weight: {props.data[props.data.length - 1]}g
          </h4>
        </div>
      </div>

      <Chart options={options} series={series} type="area" height={350} />
    </Card>
  );
}
