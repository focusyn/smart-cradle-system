import React from "react";

import Analytics from "~/views/admin/analytics";

import { AiOutlineHome } from "react-icons/ai";

const routes = [
  {
    name: "home_dashboard",
    layout: "/admin",
    path: "home",
    icon: <AiOutlineHome className="h-6 w-6" />,
    component: <Analytics />,
  },
];
export default routes;
