import { useState, useEffect } from "react";
import { FaTemperatureLow } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import { RiPlantFill } from "react-icons/ri";
import Widget from "~/components/widget/Widget";
import Card from "~/components/card";
import { AiOutlinePoweroff } from "react-icons/ai";
import { ref, onValue, update } from "firebase/database";
import { RTDB } from "~/Firebase";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import GaugeChart from "react-gauge-chart";
import ServerSendData from "./components/ServerSendData";

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
            textColor="black"
            formatTextValue={(value) => {
              return value + " W/m2";
            }}
          />
        </Card>
      </div>
    </div>
  );
}
