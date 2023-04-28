import React, { useState, useEffect } from "react";
import InputField from "~/components/fields/InputField";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      localStorage.setItem(
        "user",
        JSON.stringify({ userName, email, password })
      );
      navigate("/admin/home");
    } catch (err) {
      setError(err?.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (
      localStorage.getItem("user") &&
      localStorage.getItem("user") !== "null"
    ) {
      navigate("/admin/home");
    }
  }, [
    localStorage.getItem("user") && localStorage.getItem("user") !== "null",
    navigate,
  ]);

  return (
    <div className="mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      {/* Sign in section */}
      <div className="mt-[2vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Create an account
        </h4>
        <p className="ml-1 mb-9 text-base text-gray-600">
          Enter your name, email and password to sign up!
        </p>
        <InputField
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          variant="auth"
          extra="mb-3"
          label="Name*"
          placeholder="John Doe"
          id="name"
          type="text"
        />
        {/* Email */}
        <InputField
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant="auth"
          extra="mb-3"
          label="Email*"
          placeholder="mail@email.com"
          id="email"
          type="email"
        />
        {/* Password */}

        <form className="mb-5 flex items-center">
          <div className="relative w-full">
            <InputField
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="auth"
              label="Password*"
              placeholder="Min. 8 characters"
              id="password"
              type={showPassword ? "text" : "password"}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              type="button"
              className="absolute inset-y-0 right-0 top-8 flex items-center pr-3"
            >
              {!showPassword ? (
                <AiOutlineEyeInvisible
                  size={20}
                  className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                />
              ) : (
                <AiOutlineEye
                  size={20}
                  className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                />
              )}
            </button>
          </div>
        </form>
        {/* Checkbox */}

        {loading ? (
          <button className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
            <CircularProgress size={24} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
          >
            Sign Up
          </button>
        )}
        <div className="mt-4">
          <span className="text-sm font-medium text-navy-700 dark:text-gray-600">
            Already have an account?
          </span>
          <Link
            to="/auth/sign-in"
            className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
          >
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
