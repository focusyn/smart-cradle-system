import { useState, useEffect } from "react";
import PieChartCard from "~/views/admin/analytics/components/PieChartCard";
import { FaTemperatureLow } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import { RiPlantFill } from "react-icons/ri";
import Widget from "~/components/widget/Widget";
import Card from "~/components/card";
import Slider from "@mui/material/Slider";
import { AiOutlinePoweroff } from "react-icons/ai";
import { ref, onValue, update } from "firebase/database";
import { RTDB } from "~/Firebase";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import GaugeChart from "react-gauge-chart";
import ServerSendData from "./components/ServerSendData";
import addNotification from "react-push-notification";

function valuetext(value) {
  return `${value} ms`;
}

function valueLabelFormat(value) {
  return `${value} ms`;
}

export default function Analytics() {
  const { t } = useTranslation();
  const [temperature, setTemperature] = useState(32.5);
  const [humidity, setHumidity] = useState(60.8);
  const [moisture, setMoisture] = useState(20);
  const [soundLevel, setSoundLevel] = useState(50);
  const [weight, setWeight] = useState(0);
  const [avgWeight, setAvgWeight] = useState(0);
  const [motion, setMotion] = useState(1);
  const [swing, setSwing] = useState(false);
  const [swingSpeed, setSwingSpeed] = useState(30);
  const [loading, setLoading] = useState(false);

  // read

  const fetchSensorData = () => {
    onValue(ref(RTDB), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTemperature(data?.sensor?.DATA?.Temperature);
        setHumidity(data?.sensor?.DATA?.Humidity);
        setMoisture(data?.sensor?.DATA?.Moisture);
        setSoundLevel(data?.sensor?.DATA?.Sound);
        setWeight(data?.sensor?.DATA?.Weight);
        setAvgWeight(data?.sensor?.DATA?.AvgWeight);
        setMotion(data?.sensor?.DATA?.Motion);

        // console length of data collection
      } else {
        console.log("No data available");
      }
    });
  };

  const checkMotion = () => {
    if (motion !== 1) {
      addNotification({
        title: "Motion detected!",
        subtitle: "Motion detected!",
        message: "Someone is in the room!",
        theme: "darkblue",
        native: true, // when using native, your OS will handle theming.
      });
    }
  };

  const checkMoisture = () => {
    if (moisture > 50) {
      addNotification({
        title: "Moisture level is high!",
        subtitle: "Moisture level is high!",
        message: "Please check the baby!",
        theme: "darkblue",
        native: true, // when using native, your OS will handle theming.
      });
    }
  };

  const checkTemperature = () => {
    if (temperature > 35) {
      addNotification({
        title: "Temperature is high!",
        subtitle: "Temperature is high!",
        message: "Please check the baby!",
        theme: "darkblue",
        native: true, // when using native, your OS will handle theming.
      });
    }
    if (temperature < 15) {
      addNotification({
        title: "Temperature is low!",
        subtitle: "Temperature is low!",
        message: "Please check the baby!",
        theme: "darkblue",
        native: true, // when using native, your OS will handle theming.
      });
    }
  };

  const checkSound = () => {
    if (soundLevel > 125) {
      addNotification({
        title: "Sound level is high!",
        subtitle: "Sound level is high!",
        message: "Baby is crying!",
        theme: "darkblue",
        native: true, // when using native, your OS will handle theming.
      });
    }
  };

  const checkWeight = () => {
    if (weight < 10) {
      addNotification({
        title: "Weight is low!",
        subtitle: "Weight is low!",
        message: "Please check the baby!",
        theme: "darkblue",
        native: true, // when using native, your OS will handle theming.
      });
    }
  };

  const toggleServo = () => {
    toast.success("Servo is " + (swing ? "OFF" : "ON"));
    setLoading(true);
    setSwing(!swing);
    const dbRef = ref(RTDB, "/sensor/DATA");

    if (swing) {
      update(dbRef, {
        Servo: false,
      });
    } else {
      update(dbRef, {
        Servo: true,
      });
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    setInterval(() => {
      fetchSensorData();
    }, 2000);

    return () => {
      clearInterval();
    };
  }, []);

  useEffect(() => {
    checkMotion();
    checkMoisture();
    checkTemperature();
    checkSound();
    checkWeight();
  }, [motion, moisture, temperature, soundLevel, weight]);

  return (
    <div className="mt-5 mb-10">
      {/* Card widget */}
      <div className="flex items-center justify-between rounded-t-3xl p-3">
        <button className="linear rounded-[20px] bg-lightPrimary px-4 py-2 text-base font-medium text-brand-500 transition duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 dark:active:bg-white/20">
          Swing Status
        </button>

        <button
          onClick={toggleServo}
          className="linear rounded-[20px] bg-brand-500  px-4 py-2 text-base font-medium text-lightPrimary transition duration-200 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 dark:active:bg-white/20"
        >
          {loading ? (
            "Loading..."
          ) : (
            <>
              <span className="flex items-center justify-center">
                {swing ? (
                  <>
                    {" "}
                    <span>{t("turn_off")}</span>
                    <AiOutlinePoweroff className="ml-1 inline-block" />
                  </>
                ) : (
                  <>
                    <span>{t("turn_on")}</span>
                    <AiOutlinePoweroff className="ml-1 inline-block" />
                  </>
                )}
              </span>
            </>
          )}
        </button>
      </div>
      {/* <Card extra="rounded-[20px] py-3 px-3">
        <div className="flex flex-row justify-between px-3 pt-2">
          <div>
            <h4 className="text-lg font-bold text-navy-700 dark:text-white">
              Swing Speed Delay
            </h4>
          </div>
        </div>

        <div className="px-10">
          <Slider
            aria-label="Temperature"
            defaultValue={10}
            getAriaValueText={valuetext}
            valueLabelFormat={valueLabelFormat}
            valueLabelDisplay="auto"
            step={10}
            marks
            min={0}
            max={30}
            sx={{
              color: "#6AD2FF",
            }}
          />
        </div>
      </Card> */}
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget
          icon={<FaTemperatureLow className="h-7 w-7" />}
          title={t("temperature")}
          subtitle={temperature + " °C"}
        />
        <Widget
          icon={<WiHumidity className="h-7 w-7" />}
          title={t("humidity")}
          subtitle={humidity + " g.m-3"}
        />
        <Widget
          icon={<RiPlantFill className="h-7 w-7" />}
          title="Moisture"
          subtitle={moisture + " kg/kg or m~/m3"}
        />
        <ServerSendData weight={weight} avgWeight={avgWeight} />
        <Card extra="rounded-[20px] p-3">
          <div className="flex flex-row justify-between px-3 pt-2">
            <div>
              <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                Sound Level
              </h4>
            </div>
          </div>

          <GaugeChart
            nrOfLevels={20}
            percent={soundLevel / 255}
            needleColor="red"
            textColor="white"
            formatTextValue={(value) => {
              return value + " W/m2";
            }}
          />
        </Card>
        {/* <Widget
          icon={<BsMoisture className="h-7 w-7" />}
          title={t("water_level")}
          subtitle={soundLevel + " %"}
        /> */}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <PieChartCard />
        </div>
      </div>
    </div>
  );
}
