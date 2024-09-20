import React from 'react'

const GroupHub = ({groupData}) => {
  return (
    <div>
      <div className="text-white bg-white bg-opacity-25 p-3 rounded-md ">
        <h1>Group Description</h1>
        <p>{groupData.groupDescription}</p>
      </div>
      <div className="">
        
      </div>
    </div>
  )
}

export default GroupHub
