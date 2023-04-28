/* eslint-disable */

import { HiX } from "react-icons/hi";
import Links from "./components/Links";
import LOGO from "~/assets/logo.png";

import routes from "~/routes.jsx";

const Sidebar = ({ open, onClose }) => {
  return (
    <div
      className={`sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${
        open ? "translate-x-0" : "-translate-x-96"
      }`}
    >
      <span
        className="absolute top-4 right-4 block cursor-pointer xl:hidden"
        onClick={onClose}
      >
        <HiX />
      </span>

      <div className={`mx-[40px] mt-[50px] flex items-center`}>
        <div className="mt-1 flex h-2.5 items-center font-poppins text-[40px] font-bold uppercase text-navy-700 dark:text-white">
          IRRI
          <span className="text-brand-500">G</span>
          <img
            className="ml-1 h-16 w-16"
            src="https://img.icons8.com/ios-filled/100/000000/infinity-large.png"
          />
        </div>
      </div>
      <div className="mt-[58px] mb-7 h-px bg-gray-300 dark:bg-white/30" />
      {/* Nav item */}

      <ul className="mb-auto mr-16 pt-1 ">
        <Links routes={routes} onClose={onClose} />
      </ul>
      {/* Nav item end */}
    </div>
  );
};

export default Sidebar;
