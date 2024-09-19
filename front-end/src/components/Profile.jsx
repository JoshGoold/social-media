import React, { useState, useEffect } from "react";
import axios from "axios";
import { useContext } from "react";
import UserContext from "../CookieContext.jsx";
import ProfileHead from "./dashboard-user/ProfileHead.jsx";
import Letter from "./dashboard-user/Letter.jsx";
import Post from "./dashboard-user/Post.jsx";
import pic from "../assets/defaultpic.png";
import Sidepanel from "./dashboard-user/Sidepanel.jsx";
import { useParams } from "react-router-dom";
import Conversations from "./dashboard-user/Conversations.jsx";
import Logout from "./registry/Logout.jsx";
import Search from "./functions/Search.jsx";

const Profile = () => {
  const { user } = useContext(UserContext);

  const { username } = useParams();



  const [userData, setUserData] = useState({
    username: "",
    email: "",
    conversations: [],
    posts: [],
    letters: [],
    profilepic: pic,
    followers: [],
    following: [],
  });

  const [navState, setNavState] = useState({
    home: false,
    conversations: false,
    profile: true,
    globalGroups: false
  })

  const [windowWidth, setWindowWidth] = useState(window.screen.width);
  const [state, setState] = useState("Letters")
  const [sideState, setSideState] = useState(false)
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    setWindowWidth(window.innerWidth)
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
    
  }, []);

  const handleUserProfile = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/user-profile?username=${username}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.Success) {
        setUserData((prevState) => ({
          ...prevState,
          username: response.data.user.username,
          email: response.data.user.email,
          posts: response.data.user.posts,
          letters: response.data.user.letters,
          profilepic: response.data.user.profilepic,
          followers: response.data.user.followers,
          following: response.data.user.following,
        }));
      } else {
        alert("An error occurred while loading the page");
        console.log(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch user profile and conversations
  useEffect(() => {
    handleUserProfile();
  }, [user]);

  return (
    <div className="flex  h-screen">
      {/* {windowWidth > 1000 ? (
        <div className="flex-2 small-sidepanel">
          <Sidepanel navState={navState} setNavState={setNavState} userData={userData} setUserData={setUserData} user={user} />
        </div>
      ) : (
      <div className="">
        <div className="">
          <button onClick={()=> setSideState(!sideState)} className="text-4xl hover:scale-110 hover:text-gray-300 duration-200 text-white fixed top-0 right-3">≣</button>
        </div>
        {sideState && (
          <div className="w-full h-screen">
          <Sidepanel userData={userData} setUserData={setUserData} user={user} />
          </div>
        )}
        </div>
      )} */}
      
      <div className="p-2 overflow-scroll  hide-scrollbar flex w-full flex-col items-center">
        <ProfileHead
          userData={userData}
          setUserData={setUserData}
          handleUserProfile={handleUserProfile}
          user={user}
        />
        {windowWidth > 1000 ? (
          <div className="flex w-full gap-2 mt-5">
            <div className="shadow-md rounded-lg bg-opacity-10 bg-white w-full p-2">
              <h1 className="font-thin text-white text-2xl">Letters</h1>
            </div>
            <div className="shadow-md w-full rounded-lg bg-opacity-10 bg-white p-2">
              <h1 className="font-thin text-white text-2xl">Posts</h1>
            </div>
          </div>
        ) : 
        (
          <div className="text-white items-center flex gap-1 w-full bg-opacity-15 bg-purple-800 mt-10">
            <button onClick={()=> setState("Letters")} className="bg-slate-600  bg-opacity-30 p-3 hover:bg-slate-500">Letters</button>
            <button onClick={()=> setState("Posts")}  className="bg-slate-600 bg-opacity-30 p-3 hover:bg-slate-500" >Posts</button>
            <button  onClick={()=> setState("Conversations")}  className="bg-slate-600 bg-opacity-30 p-3 hover:bg-slate-500">Conversations</button>
            
          </div>
        )}
      {windowWidth > 1000 ? (
        <div className="flex small-letpost border-t-2 mt-3 border-black w-full">
          <div className="w-full ">
            <Letter
              userData={userData}
              setUserData={setUserData}
              handleUserProfile={handleUserProfile}
              user={user}
            />
          </div>
          <div className="w-full  ">
            <Post
              userData={userData}
              setUserData={setUserData}
              handleUserProfile={handleUserProfile}
              user={user}
            />
          </div>
        </div>) : (
          <div className="flex small-letpost border-t-2 mt-3 border-black w-full">
            {state === "Letters" && (
          <div className="w-full ">
            <Letter
              userData={userData}
              setUserData={setUserData}
              handleUserProfile={handleUserProfile}
              user={user}
            />
          </div>
        )}
        {state === "Posts" && (
          <div className="w-full  ">
            <Post
              userData={userData}
              setUserData={setUserData}
              handleUserProfile={handleUserProfile}
              user={user}
            />
          </div>)}
          {state === "Conversations" && (

            <Conversations
            userData={userData}
            setUserData={setUserData}
            user={user}
          />

          )}
        </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
