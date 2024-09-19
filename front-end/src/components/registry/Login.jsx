import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const nav = useNavigate();
  const [userInfo, setUserInfo] = useState({
    username: undefined,
    password: undefined,
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    if (userInfo.password === "" || userInfo.username === "") {
      alert("Please enter all specified fields");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/login`,
        {
          username: userInfo.username,
          password: userInfo.password,
        },
        { withCredentials: true }
      );
      if (response.data.login) {
        nav(`/dashboard/${response.data.userCookie.username}`);
      } else {
        alert("Invalid Credentials");
        console.error(response.data.Message);
      }
    } catch (error) {
      console.error("Server Error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="relative h-screen">
      <div className="a-center text-2xl absolute shadow-lg border shadow-black bg-transparentbg-opacity-85 rounded-lg  p-14">
        <form onSubmit={(e) => handleLogin(e)}>
          <ul className="flex flex-col justify-center gap-4 items-center">
            <li className="text-3xl text-white mt-5 mb-8">Login</li>
            <li className="flex flex-col">
              <h2 className=" font-thin text-white">Username </h2>
              <input
                className="shadow-md font-thin  p-2"
                type="text"
                onChange={(e) =>
                  setUserInfo((prev) => ({ ...prev, username: e.target.value }))
                }
                required
                placeholder="Enter your username"
              />
            </li>
            <li className="flex flex-col">
              <h2 className=" font-thin text-white">Password </h2>
              <input
                className="shadow-md font-thin  p-2"
                type="password"
                onChange={(e) =>
                  setUserInfo((prev) => ({ ...prev, password: e.target.value }))
                }
                required
                placeholder="Enter your password"
              />
            </li>
            <li className="mt-5">
              <button
                className="rounded-md w-64 bg-blue-500 font-thin  text-white px-3 py-1"
                type="submit"
              >
                Login
              </button>
            </li>
            <li
              className="text-sm text-purple-600 mt-5"
              onClick={() => nav("/")}
            >
              Create new account
            </li>
          </ul>
        </form>
      </div>
    </div>
  );
};

export default Login;
