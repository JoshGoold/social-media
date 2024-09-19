import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FaHome } from 'react-icons/fa'
import axios from 'axios'
import GroupMessage from '../function/GroupMessage'
import GroupHub from './GroupHub'
import GroupMembers from './GroupMembers'
import GroupLetters from './GroupLetters'
import GroupPosts from './GroupPosts'
import GroupChat from './GroupChat'
import CreateGroupLetter from '../function/CreateGroupLetter'
import CreateGroupPost from '../function/CreateGroupPost'

const GroupPage = () => {
    const nav = useNavigate()
    const {username, groupname, groupid} = useParams()
    const [navState, setNavState] = useState("Hub")
    const [groupData, setGroupData] = useState([])

    async function getGroupData(){
        try {
            const response = await axios.get(`http://localhost:3000/group-data?id=${groupid}`,{withCredentials:true})
            if(response.data.Success){
                setGroupData(response.data.groupData)
            } else{
                alert(response.data.Message)
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(()=>{
        getGroupData()
    },[groupData])
  return (
    <div className="p-3 overflow-scroll h-screen hide-scrollbar">
        <div className="flex justify-between p-4">
        <div className="text-white text-3xl" onClick={()=> nav(`/dashboard/${username}`)} >
            <FaHome/>
        </div>
        <div className="">
            <h1 className='text-white text-3xl font-thin'>Welcome to the {groupname}</h1>
        </div>
        </div>
        <div className="">
            <ul className='flex gap-3 text-white'>
                <li onClick={()=> setNavState("Hub")} className={`bg-blue-500 rounded-md ${navState === "Hub" ? "bg-purple-500" : ""} p-2 cursor-pointer`}>Hub</li>
                <li onClick={()=> setNavState("Members")} className={`bg-blue-500 rounded-md ${navState === "Members" ? "bg-purple-500" : ""} p-2 cursor-pointer`}>Members</li>
                <li onClick={()=> setNavState("Letters")} className={`bg-blue-500 rounded-md ${navState === "Letters" ? "bg-purple-500" : ""} p-2 cursor-pointer`}>Letters</li>
                <li onClick={()=> setNavState("Posts")} className={`bg-blue-500 rounded-md ${navState === "Posts" ? "bg-purple-500" : ""} p-2 cursor-pointer`}>Posts</li>
                <li onClick={()=> setNavState("Chat")} className={`bg-blue-500 rounded-md ${navState === "Chat" ? "bg-purple-500" : ""} p-2 cursor-pointer`}>Chat</li>
            </ul>
        </div>
        {navState === "Hub" && (
            <div className="mt-3">
                <GroupHub/>
            </div>
        )}
        {navState === "Members" && (
            <div className="mt-3">
                <GroupMembers groupData={groupData}/>
            </div>
        )}
        {navState === "Letters" && (
            <div className="mt-3">
                <div className="mb-3">
                    <CreateGroupLetter getData={getGroupData} groupid={groupid}/>
                </div>
                <GroupLetters groupData={groupData} groupid={groupid} getData={getGroupData}/>
            </div>
        )}
        {navState === "Posts" && (
            <div className="mt-3">
                <div className="mb-3">
                    <CreateGroupPost getData={getGroupData} groupid={groupid}/>
                </div>
                <div className="max-w-[40%] ml-auto mr-auto">
                <GroupPosts groupData={groupData} groupid={groupid} getData={getGroupData}/>
                </div>
            </div>
        )}
        {navState === "Chat" && (
            <div className="mt-3">
                <GroupChat groupData={groupData}  groupid={groupid} getData={getGroupData}  groupname={groupname}/>
            </div>
        )}
      
    </div>
  )
}

export default GroupPage
