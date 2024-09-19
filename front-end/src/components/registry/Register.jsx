import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const nav = useNavigate();
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    password: "",
  });
  //email validation
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)*[a-zA-Z]{2,}))$/;
  const validateEmailComprehensive = (email) => {
    return re.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (
      userInfo.email === "" ||
      userInfo.password === "" ||
      userInfo.username === ""
    ) {
      alert("Please enter all specified fields");
      return; // Exit function if any field is empty
    }

    if (!validateEmailComprehensive(userInfo.email)) {
      alert("Enter a valid email address");
      return; // Exit function if email is invalid
    }
    try {
      const response = await axios.post(`http://localhost:3000/register`, {
        username: userInfo.username,
        email: userInfo.email,
        password: userInfo.password,
      });

      if (response.data.Success) {
        nav("/login");
      } else {
        alert(response.data.Message);
      }
    } catch (error) {
      console.error(`Internal server error ----> ${error.message}`);
      alert("An unexpected error occurred. Please try again later.");
    }
  };
  return (
    <div className="relative h-screen">
      <div className="a-center text-2xl absolute shadow-lg shadow-black border bg-transparent bg-opacity-85 rounded-lg  p-14">
        <form onSubmit={(e) => handleRegister(e)}>
          <ul className="flex flex-col justify-center gap-4 items-center">
            <li className="text-3xl text-white mt-5 mb-8">Register</li>
            <li className="flex flex-col">
              <h2 className="text-white font-thin ">Username </h2>
              <div className="">
                <input
                  className="shadow-md font-thin  p-2"
                  onChange={(e) => setUserInfo((prev)=>({...prev, username: e.target.value }))}
                  type="text"
                  required
                  placeholder="Enter a username"
                />
              </div>
            </li>
            <li className="flex flex-col">
              <h2 className="text-white font-thin ">Email </h2>
              <div className="">
                <input
                  className="shadow-md font-thin  p-2"
                  onChange={(e) => setUserInfo((prev)=>({...prev, email: e.target.value }))}
                  type="text"
                  required
                  placeholder="Enter an email"
                />
              </div>
            </li>
            <li className="flex flex-col">
              <h2 className="text-white font-thin ">Password </h2>
              <div className="">
                <input
                  className="shadow-md font-thin  p-2"
                  onChange={(e) => setUserInfo((prev)=>({...prev, password: e.target.value }))}
                  type="password"
                  required
                  placeholder="Enter a password"
                />
              </div>
            </li>
            <li className="mt-5">
              <button
                className="rounded-md w-64 bg-blue-500 font-thin  text-white px-3 py-1"
                type="submit"
              >
                Register
              </button>
            </li>
            <li
              className="text-sm text-purple-600 mt-5"
              onClick={() => nav("/login")}
            >
              Already have an account?
            </li>
          </ul>
        </form>
      </div>
    </div>
  );
};

export default Register;
