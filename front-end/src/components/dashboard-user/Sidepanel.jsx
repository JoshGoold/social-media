import React from "react";
import Search from "../functions/Search";
import Conversations from "./Conversations";
import Logout from "../registry/Logout";
import NavBar from "../NavBar";

const Sidepanel = (props) => {
  return (
    <div className="flex flex-col bg-white bg-opacity-10 overfolow-y-auto p-3 h-full">
      <Search />
      <NavBar setSideState={(props.setSideState)} setNavState={props.setNavState} navState={props.navState}/>

      {props.navState.conversations === true && (
        <Conversations
        userData={props.userData}
        setUserData={props.setUserData}
        user={props.user}
      />
      )}
      <div className="mt-auto">
        <Logout />
      </div>
    </div>
  );
};

export default Sidepanel;
