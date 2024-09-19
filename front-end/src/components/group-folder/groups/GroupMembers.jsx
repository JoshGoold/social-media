import React from 'react'

const GroupMembers = ({groupData}) => {
  return (
    <div>
      {groupData.participants.map((person, index)=>(
        <div className="text-white" key={index}>
            <ul className='flex items-center gap-2'>
              <li><img className='rounded-full' height={50} width={50} src={`http://localhost:3000${person.participant_profilePic}`} alt="" /></li>
              <li>{person.participant_name}</li>
            </ul>
        </div>
      ))}
    </div>
  )
}

export default GroupMembers
