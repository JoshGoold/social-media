import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useState } from 'react'
import { FaUser } from 'react-icons/fa'

const GroupMembers = ({groupData, groupid, getData}) => {
  const nav = useNavigate()

  async function denyRequest(username){
    try {
      const response = await axios.post("http://localhost:3000/deny-participant", {
        groupid: groupid,
        username: username
      }, {withCredentials: true})

      if(response.data.Success){
        alert(response.data.Message)
        getData()
      } else{
        alert(response.data.Message)
      }
    } catch (error) {
      console.error(`Axios Error ---> ${error}`)
    }
  }
  async function acceptRequest(username){
    try {
      const response = await axios.post("http://localhost:3000/accept-participant", {
        groupid: groupid,
        username: username
      }, {withCredentials: true})

      if(response.data.Success){
        alert(response.data.Message)
        getData()
      } else{
        alert(response.data.Message)
      }
    } catch (error) {
      console.error(`Axios Error ---> ${error}`)
    }
  }

  return (
    <div className='flex justify-between'>
      <div className="">
        <h1 className='font-thin text-white text-2xl'>Members</h1>
      {groupData.participants.map((person, index)=>(
        <div className="text-white" key={index}>
            <ul className='flex items-center gap-2'>
              <li onClick={()=>nav(`/user-profile/${person.participant_name}`)}><img className='rounded-full' height={50} width={50} src={`http://localhost:3000${person.participant_profilePic}`} alt="" /></li>
              <li onClick={()=>nav(`/user-profile/${person.participant_name}`)}>{person.participant_name}</li>
            </ul>
        </div>
      ))}
      </div>
      <div className="">
        <h1 className='text-white font-thin text-2xl'>Requested</h1>
        {groupData?.groupAccess === "Private" && (
          <div className="">
          {groupData?.requested.map((request, index)=>(
            <ul key={index} className="flex text-white items-center gap-2">
              <li><img className='rounded-full' height={50} width={50} src={`http://localhost:3000${request.participant_profilePic}`}/></li>
              <li  onClick={()=>nav(`/user-profile/${request.participant_name}`)}>{request.participant_name}</li>
              <li><button onClick={()=>acceptRequest(request.participant_name)} className='bg-green-500 p-2 rounded-md'>Accept</button></li>
              <li><button onClick={()=>denyRequest(request.participant_name)} className='bg-red-500 p-2 rounded-md'>Deny</button></li>
            </ul>
          ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default GroupMembers
