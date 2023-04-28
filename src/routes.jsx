import React from "react";

import Analytics from "~/views/admin/analytics";
// Auth Imports
import SignIn from "~/views/auth/SignIn";
import Signup from "~/views/auth/Signup";
import { AiOutlineHome } from "react-icons/ai";
import { MdLock } from "react-icons/md";

const routes = [
  {
    name: "home_dashboard",
    layout: "/admin",
    path: "home",
    icon: <AiOutlineHome className="h-6 w-6" />,
    component: <Analytics />,
  },
  {
    name: "sign_in",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
  },
  {
    name: "sign_up",
    layout: "/auth",
    path: "sign-up",
    icon: <MdLock className="h-6 w-6" />,
    component: <Signup />,
  },
];
export default routes;
