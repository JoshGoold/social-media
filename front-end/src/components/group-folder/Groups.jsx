import React from 'react'
import { useEffect,useState } from 'react'
import axios from 'axios'
import Sports from './pages/Sports'
import Political from './pages/Political'
import Technology from './pages/Technology'
import Social from './pages/Social'
import Arts from './pages/Arts'
import Academic from './pages/Academic'
import YourGroups from './YourGroups'
import { FaHome } from "react-icons/fa";
import { useParams } from 'react-router-dom'
import Religion from './pages/Religion'

const Groups = () => {
const [navState, setNavState] = useState("")
const { username } = useParams()

  return (
    <div className='mt-3'>
      <div className="">
      <ul className='text-white flex items-center justify-center gap-3'>
        <li onClick={()=>setNavState("")} className={`p-10 font-thin cursor-pointer ${navState === "" ? "bg-blue-500" : "bg-purple-500"} hover:bg-purple-600 hover:bg-opacity-30 duration-200 bg-opacity-40`}><FaHome/></li>
        <li onClick={()=>setNavState("Political")} className={`p-8 font-thin cursor-pointer ${navState === "Political" ? "bg-blue-500" : "bg-purple-500"} hover:bg-purple-600 hover:bg-opacity-30 duration-200 bg-opacity-40`}>Political</li>
        <li onClick={()=>setNavState("Social")} className={`p-8 font-thin cursor-pointer ${navState === "Social" ? "bg-blue-500" : "bg-purple-500"} hover:bg-purple-600 hover:bg-opacity-30 duration-200 bg-opacity-40`}>Social</li>
        <li onClick={()=>setNavState("Sports")} className={`p-8 font-thin cursor-pointer ${navState === "Sports" ? "bg-blue-500" : "bg-purple-500"} hover:bg-purple-600 hover:bg-opacity-30 duration-200 bg-opacity-40`}>Sports</li>
        <li onClick={()=>setNavState("Academic")} className={`p-8 font-thin cursor-pointer ${navState === "Academic" ? "bg-blue-500" : "bg-purple-500"} hover:bg-purple-600 hover:bg-opacity-30 duration-200 bg-opacity-40`}>Academic</li>
        <li onClick={()=>setNavState("Arts")} className={`p-8 font-thin cursor-pointer ${navState === "Arts" ? "bg-blue-500" : "bg-purple-500"} hover:bg-purple-600 hover:bg-opacity-30 duration-200 bg-opacity-40`}>Arts</li>
        <li onClick={()=>setNavState("Religion")} className={`p-8 font-thin cursor-pointer ${navState === "Religion" ? "bg-blue-500" : "bg-purple-500"} hover:bg-purple-600 hover:bg-opacity-30 duration-200 bg-opacity-40`}>Religion</li>
        <li onClick={()=>setNavState("Technology")} className={`p-8 font-thin cursor-pointer ${navState === "Technology" ? "bg-blue-500" : "bg-purple-500"} hover:bg-purple-600 hover:bg-opacity-30 duration-200 bg-opacity-40`}>Technology</li>
      </ul>
      </div>

      <div className="mt-3">
      {navState === "" && (
        <YourGroups user={username}/>
      )}
      {navState === "Sports" && (
        <Sports user={username}/>
      )}
      {navState === "Political" && (
        <Political user={username}/>
      )}
      {navState === "Technology" && (
        <Technology user={username}/>
      )}
      {navState === "Religion" && (
        <Religion user={username}/>
      )}
      {navState === "Social" && (
        <Social user={username}/>
      )}
      {navState === "Arts" && (
        <Arts user={username}/>
      )}
      {navState === "Academic" && (
        <Academic user={username}/>
      )}
      </div>
    </div>
  )
}

export default Groups
