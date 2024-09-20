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
    const [groupData, setGroupData] = useState({
        conversations: [],
        groupAccess: "",
        groupAdmins: [],
        groupCategory: "",
        groupDescription: "",
        groupModerators: "",
        groupProfilePic: "",
        letters: [],
        memberCount: "",
        owner: {},
        participants: [],
        posts: [],
        requested: []
    })

    async function getGroupData(){
        try {
            const response = await axios.get(`http://localhost:3000/group-data?id=${groupid}`,{withCredentials:true})
            if(response.data.Success){
                setGroupData((prev)=> ({...prev, 
                    groupAccess: response.data.groupData.groupAccess,
                    groupAdmins: response.data.groupData.groupAdmins,
                    groupCategory: response.data.groupData.groupCategory,
                    groupDescription: response.data.groupData.groupDescription,
                    groupModerators: response.data.groupData.groupModerators,
                    groupProfilePic: response.data.groupData.groupProfilePicture,
                    letters: response.data.groupData.letters,
                    memberCount: response.data.groupData.memberCount,
                    owner: response.data.groupData.owner,
                    participants: response.data.groupData.participants,
                    posts: response.data.groupData.posts,
                    requested: response.data.groupData.requested_participants
                }))
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
                <GroupHub groupData={groupData}/>
                <div className="flex mt-3">
                    <div className="w-[50%]">
                    <GroupLetters groupData={groupData} groupid={groupid} getData={getGroupData}/>
                    </div>
                    <div className="w-[50%]">
                    <GroupPosts groupData={groupData} groupid={groupid} getData={getGroupData}/>
                    </div>
                </div>
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
                <GroupChat groupData={groupData} setGroupData={setGroupData}  groupid={groupid} getData={getGroupData}  groupname={groupname}/>
            </div>
        )}
      
    </div>
  )
}

export default GroupPage
