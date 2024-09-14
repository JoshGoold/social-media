import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const Following = (props) => {
    const nav = useNavigate()
    const [state, setState] = useState(false)
  return (
    <div>
        <div onClick={()=>setState(!state)}>Following: {props.userData?.following?.length || 0}
                    {props.userData.following.map((follow, index)=>(
                    <div key={index}>
                    {state && (
                      <p key={index} onClick={()=> nav(`/user-profile/${follow.username}`)} id={follow.id}>{follow.username}</p>
                    )}
                    </div>
                ))}</div>
    </div>
  )
}

export default Following
