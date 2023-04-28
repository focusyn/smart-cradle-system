import React, { useState, useEffect } from "react";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import { RiRefreshLine } from "react-icons/ri";
import CircularProgress from "@mui/material/CircularProgress";

const Navbar = () => {
  const [darkmode, setDarkmode] = useState(
    localStorage.getItem("darkmode") === "true" ? true : false
  );

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (darkmode) {
      if (!document.documentElement.classList.contains("dark"))
        document.documentElement.classList.add("dark");
      else return;
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkmode]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      window.location.reload();
    }, 2000);
  };

  return (
    <nav className="sticky top-0 z-10 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
      <div className="relative mt-[3px] flex h-[61px] w-[355px] flex-grow items-center justify-between gap-2 rounded-full bg-white px-10 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-[365px] md:flex-grow-0 md:gap-1 xl:w-[365px] xl:gap-2">
        <div
          className="text-gray-600 cursor-pointer"
          onClick={() => {
            if (darkmode) {
              localStorage.setItem("darkmode", "false");
              document.body.classList.remove("dark");
              setDarkmode(false);
            } else {
              localStorage.setItem("darkmode", "true");
              document.body.classList.add("dark");
              setDarkmode(true);
            }
          }}
        >
          {darkmode ? (
            <RiSunFill className="w-5 h-5 text-gray-600 dark:text-white" />
          ) : (
            <RiMoonFill className="w-5 h-5 text-gray-600 dark:text-white" />
          )}
        </div>
        <button
          onClick={handleRefresh}
          id="refresh-icon"
          className="linear rounded-[20px] bg-brand-500  px-4 py-2 text-base font-medium text-lightPrimary transition duration-200 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 dark:active:bg-white/20"
        >
          {isRefreshing ? (
            <span className="flex items-center justify-center">
              <CircularProgress
                size={22}
                sx={{
                  color: "#fff",
                }}
              />
            </span>
          ) : (
            <>
              <span className="flex items-center justify-center">
                <RiRefreshLine
                  size={22}
                  className={` text-white ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
              </span>
            </>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
