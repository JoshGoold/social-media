import React from 'react'
import { useNavigate } from 'react-router-dom'

const GroupMembers = ({groupData}) => {
  const nav = useNavigate()
  return (
    <div>
      {groupData.participants.map((person, index)=>(
        <div className="text-white" key={index}>
            <ul className='flex items-center gap-2'>
              <li onClick={()=>nav(`/user-profile/${person.participant_name}`)}><img className='rounded-full' height={50} width={50} src={`http://localhost:3000${person.participant_profilePic}`} alt="" /></li>
              <li onClick={()=>nav(`/user-profile/${person.participant_name}`)}>{person.participant_name}</li>
            </ul>
        </div>
      ))}
    </div>
  )
}

export default GroupMembers
