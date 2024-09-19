import React from 'react'
import GroupMessage from '../function/GroupMessage'

const GroupChat = ({id, groupname, getData, groupData}) => {
  return (
    <div className='w-full flex justify-center'>
        <div className="fixed bottom-0 w-[50%]">
            <GroupMessage id={id} groupname={groupname}/>
        </div>
    </div>
  )
}

export default GroupChat
