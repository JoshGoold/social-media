import React from "react";
import Followers from "./Followers";
import Following from "./Following";

const UserProfileHead = (props) => {
  return (
    <div className="flex flex-col text-white items-center">
      <div className="">
        <div className="">
          <img
           className="rounded-full"
            height={200}
            width={200}
            src={`http://localhost:3000${props.userData.profilepic}`}
            alt="no image"
          />
        </div>
        <div className="flex flex-col items-center">
          <h1>{props.userData.username || "N/A"}</h1>
          <h1>{props.userData.email || "N/A"}</h1>
        </div>
      </div>
      <div className="flex gap-4">
        <Followers userData={props.userData} />
        <Following userData={props.userData} />
      </div>
    </div>
  );
};

export default UserProfileHead;
