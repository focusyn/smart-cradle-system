import React, { useState, useEffect } from 'react';
import GaugeChart from 'react-gauge-chart';
import axios from 'axios';
import toast from 'react-hot-toast';
import Iframe from 'react-iframe';

//icons
import { FaTemperatureHigh } from 'react-icons/fa';
import { WiHumidity } from 'react-icons/wi';
import { GiFarmTractor } from 'react-icons/gi';
import { BsFillCloudRainFill } from 'react-icons/bs';
import { RiRefreshLine } from 'react-icons/ri';
//water level
import { BsMoisture } from 'react-icons/bs';
import { IoWater } from 'react-icons/io5';
import { IoWaterOutline } from 'react-icons/io5';

const blynkToken = '0ftB5OCDk0z6s9Thl8XULZxUAntgtz8d';
export default function Dashboard() {
  const [tempdata, setTempdata] = useState('0.5');
  const [humdata, setHumdata] = useState('0.5');
  const [soilMoisture, setSoilMoisture] = useState('0.5');
  const [raindata, setRaindata] = useState('0.5');
  const [waterLevel, setWaterLevel] = useState('50');
  const [motiondata, setMotiondata] = useState(0);
  const [pumpState, setPumpState] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeviceOnline, setIsDeviceOnline] = useState(false);

  const handlePumpToggle = () => {
    setPumpState(!pumpState);
    axios
      .get(
        `https://blynk.cloud/external/api/update?token=${blynkToken}&v5=${
          pumpState ? 0 : 1
        }`
      )
      .then((res) => {
        toast.success('Water Pump is turned ' + (pumpState ? 'off' : 'on'));
      })
      .catch((err) => {
        console.log(err);
        toast.error('Something went wrong', {
          icon: '⚠️',
          style: {
            borderRadius: '10px',
            background: '#fff',
            color: '#000',
          },
        });
      });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      window.location.reload();
    }, 2000);
  };

  const isDeviceOnlineHandler = () => {
    axios
      .get(
        `https://blynk.cloud/external/api/isHardwareConnected?token=${blynkToken}`
      )
      .then((res) => {
        setIsDeviceOnline(res?.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error('Something went wrong', {
          icon: '⚠️',
          style: {
            borderRadius: '10px',
            background: '#fff',
            color: '#000',
          },
        });
      });
  };

  const checkMotion = () => {
    axios
      .get(`https://blynk.cloud/external/api/get?token=${blynkToken}&v6`)
      .then((res) => {
        setMotiondata(res?.data);
        if (motiondata === 1) {
          toast.success('Motion Detected');
          console.log('motion detected');
        }
      })
      .catch((err) => {
        toast.error('Not able to read sensor data, try refreshing', {
          icon: '⚠️',
          style: {
            borderRadius: '10px',
            background: '#fff',
            color: '#000',
          },
        });
      });
  };

  useEffect(() => {
    if (isDeviceOnline) {
      axios
        .get(
          `https://blynk.cloud/external/api/get?token=${blynkToken}&v3&v4&v0&v1&v5&v2`
        )
        .then((res) => {
          setTempdata(res?.data?.v3);
          setHumdata(res?.data?.v4);
          setSoilMoisture(res?.data?.v0);
          setRaindata(res?.data?.v1);
          setPumpState(res?.data?.v5);
          setWaterLevel(res?.data?.v2);
        })
        .catch((err) => {
          toast.error('Not able to read sensor data, try refreshing', {
            icon: '⚠️',
            style: {
              borderRadius: '10px',
              background: '#fff',
              color: '#000',
            },
          });
        });
    }
    const interval = setInterval(() => {
      isDeviceOnlineHandler();
      checkMotion();
    }, 1000);
    return () => clearInterval(interval);
  }, [isDeviceOnline, motiondata, pumpState]);

  return (
    <>
      <div className="flex h-screen bg-gray-800 ">
        {/* <!-- Mobile sidebar --> */}
        {/* <!-- Backdrop --> */}
        <div className="flex flex-col flex-1 w-full overflow-y-auto">
          <main className="">
            <div
              onClick={handleRefresh}
              id="refresh-icon"
              className="fixed z-10 p-2 bg-gray-800 rounded-full shadow-md cursor-pointer bottom-10 right-14 shadow-slate-50 hover:bg-gray-700"
            >
              <RiRefreshLine
                size={22}
                className={` text-white ${isRefreshing ? 'animate-spin' : ''}`}
              />
            </div>
            <div className="grid px-2 bg-black border-2 border-blue-500 rounded-3xl ">
              <div className="grid grid-cols-12 gap-6">
                <div className="grid grid-cols-12 col-span-12 gap-6 xxl:col-span-9">
                  <div className="col-span-12 mt-8">
                    <div className="flex items-center h-10 intro-y">
                      <div className="indicator">
                        <span
                          className={`indicator-item badge  text-white ${
                            isDeviceOnline ? ' bg-green-500' : ' bg-red-500'
                          }`}
                        >
                          {isDeviceOnline ? 'Online' : 'Offline'}
                        </span>
                        <h2 className="mr-5 text-lg font-medium text-white truncate">
                          Smart Farming{' '}
                        </h2>
                      </div>
                    </div>
                    <div className="grid grid-cols-12 gap-6 mt-5">
                      {/* TODO: Temperature */}
                      <div className="col-span-12 transition duration-300 transform bg-gray-800 rounded-lg shadow-xl hover:scale-105 sm:col-span-6 xl:col-span-3 intro-y">
                        <div className="p-5">
                          <div className="flex justify-between">
                            <FaTemperatureHigh
                              className="text-[#62bbfe] text-4xl"
                              size={40}
                            />
                            <span className="bg-[#62bbfe] rounded-full h-6 px-2 flex justify-items-center text-white font-semibold text-sm">
                              Temperature
                            </span>
                          </div>
                          <div className="flex-1 w-full ml-2">
                            <GaugeChart
                              nrOfLevels={20}
                              percent={tempdata / 100}
                              needleColor="red"
                              textColor="white"
                              formatTextValue={(value) => {
                                return value + '°C';
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      {/* TODO: Humidity */}
                      <div className="col-span-12 transition duration-300 transform bg-gray-800 rounded-lg shadow-xl hover:scale-105 sm:col-span-6 xl:col-span-3 intro-y">
                        <div className="p-5">
                          <div className="flex justify-between">
                            <WiHumidity
                              className="text-[#ba3dd3] text-4xl"
                              size={40}
                            />
                            <span className="bg-[#BA3DD3] rounded-full h-6 px-2 flex justify-items-center text-white font-semibold text-sm">
                              Humidity
                            </span>
                          </div>
                          <div className="flex-1 w-full ml-2">
                            <GaugeChart
                              nrOfLevels={20}
                              percent={humdata / 100}
                              needleColor="red"
                              textColor="white"
                              formatTextValue={(value) => {
                                return value + '%';
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      {/* TODO: Soil Moisture */}
                      <div className="col-span-12 transition duration-300 transform bg-gray-800 rounded-lg shadow-xl hover:scale-105 sm:col-span-6 xl:col-span-3 intro-y">
                        <div className="p-5">
                          <div className="flex justify-between">
                            <GiFarmTractor
                              className="text-[#A1D910] text-4xl"
                              size={40}
                            />
                            <span className="bg-[#A1D910] rounded-full h-6 px-2 flex justify-items-center text-white font-semibold text-sm">
                              Soil Moisture
                            </span>
                          </div>
                          <div className="flex-1 w-full ml-2">
                            <GaugeChart
                              nrOfLevels={20}
                              percent={soilMoisture / 100}
                              needleColor="red"
                              textColor="white"
                              formatTextValue={(value) => {
                                return value + '%';
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      {/* TODO: Rain */}
                      <div className="col-span-12 transition duration-300 transform bg-gray-800 rounded-lg shadow-xl hover:scale-105 sm:col-span-6 xl:col-span-3 intro-y">
                        <div className="p-5">
                          <div className="flex justify-between">
                            <BsFillCloudRainFill className="text-4xl text-orange-500" />
                            <span className="flex h-6 px-2 text-sm font-semibold text-white bg-orange-500 rounded-full justify-items-center">
                              Rain
                            </span>
                          </div>
                          <div className="flex-1 w-full ml-2">
                            <GaugeChart
                              nrOfLevels={20}
                              percent={raindata / 100}
                              needleColor="red"
                              textColor="white"
                              formatTextValue={(value) => {
                                return value + '%';
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12 mt-5">
                    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                      <div className="col-span-12 transition duration-300 transform bg-gray-800 rounded-lg shadow-xl hover:scale-105 sm:col-span-6 xl:col-span-3 intro-y">
                        <div className="p-5">
                          <div className="form-control w-52">
                            <label className="cursor-pointer label">
                              <span className="text-white label-text">
                                Water Pump
                              </span>
                              <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                {' '}
                                {pumpState ? (
                                  <IoWater
                                    size={30}
                                    className="text-4xl text-blue-500 "
                                  />
                                ) : (
                                  <IoWaterOutline
                                    size={30}
                                    className="text-4xl text-blue-500 "
                                  />
                                )}
                              </span>

                              <input
                                onChange={handlePumpToggle}
                                type="checkbox"
                                className="toggle toggle-primary"
                                checked={pumpState}
                              />
                            </label>
                            <label className="cursor-pointer label">
                              <span className="text-white label-text">
                                Water Level
                              </span>
                              <span className="mt-5 ml-5 text-sm font-medium text-gray-900 dark:text-gray-300">
                                <div
                                  className="text-teal-500 radial-progress"
                                  style={{
                                    '--value': `${waterLevel}`,
                                    '--size': '6rem',
                                    '--color': '#62bbfe',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '5px',
                                  }}
                                >
                                  <BsMoisture
                                    size={20}
                                    className="text-4xl text-blue-500 "
                                  />{' '}
                                  <span>
                                    {waterLevel} <span>%</span>
                                  </span>
                                </div>
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12 mt-5 mb-16">
                    <div className="p-1 bg-white rounded-lg shadow-lg">
                      <h1 className="text-base font-bold">Camera</h1>
                      <div className="mt-4 ">
                        <Iframe
                          url="https://esp.biospheredev.me/client"
                          id=""
                          width="100%"
                          height="100%"
                          className="overflow-hidden rounded-xl"
                          position="relative"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
