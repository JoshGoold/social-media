import React from 'react'
import { TbMessages } from "react-icons/tb";
import { MdOutlineGroups2 } from "react-icons/md";
import { FaHome } from "react-icons/fa";
import { FaUser } from "react-icons/fa";

const NavBar = ({navState, setNavState, setSideState}) => {
  return (
    <div className='mt-4 text-center'>
     <ul className={`flex justify-center items-center text-white text-3xl gap-4 ${!navState.conversations ? "flex-col gap-12": "flex-row"}`}>
        <li onClick={()=> {
            setNavState({home: true, profile: false, globalGroups: false, conversations: false})
            setSideState(false)
            }} title='Home' className={`hover:scale-110 ${!navState.conversations ? "flex items-center gap-2" : ""} hover:text-neutral-200  cursor-pointer duration-200 ${navState.home === true ? "text-blue-500" : "text-white"}`}><FaHome/><small>{!navState.conversations ? "Home" : ""}</small></li>
        <li onClick={()=> {
            setNavState({home: false, profile: true, globalGroups: false, conversations: false})
            setSideState(false)
            }} title='Profile' className={`hover:scale-10 ${!navState.conversations ? "flex items-center gap-2" : ""} hover:text-neutral-200  cursor-pointer duration-200  ${navState.profile === true ? "text-blue-500" : "text-white"}`}><FaUser/><small>{!navState.conversations ? "Profile" : ""}</small></li>
        <li onClick={()=> {
            setNavState({home: false, profile: false, globalGroups: true, conversations: false})
            setSideState(false)}} title='Global Groups' className={`hover:scale-110 ${!navState.conversations ? "flex items-center gap-2" : ""} hover:text-neutral-200  cursor-pointer duration-200  ${navState.globalGroups === true ? "text-blue-500" : "text-white"}`}><MdOutlineGroups2/><small>{!navState.conversations ? "Groups" : ""}</small></li>
        <li onClick={()=> {
            setNavState((prev)=> ({...prev, conversations: !navState.conversations}))
            setSideState(false)}} title='Conversations' className={`hover:scale-110 ${!navState.conversations ? "flex items-center gap-2" : ""} hover:text-neutral-200  cursor-pointer duration-200  ${navState.conversations === true ? "text-blue-500" : "text-white"}`}><TbMessages/><small>{!navState.conversations ? "Chats" : ""}</small></li>
     </ul>
    </div>
  )
}

export default NavBar
