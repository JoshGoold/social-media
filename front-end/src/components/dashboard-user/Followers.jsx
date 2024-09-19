import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const Followers = (props) => {
    const nav = useNavigate()
    const [state,setState] = useState(false)
  return (
    <div>
      <div onClick={()=>setState(!state)}>
        Followers: {props.userData?.followers?.length || 0} 
                    {props.userData.followers.map((follower, index)=>(
                    <div key={index}>
                    {state && (
                      <p className="cursor-pointer" key={index} onClick={()=> nav(`/user-profile/${follower.username}`)} id={follower.id}>{follower.username}</p>
                    )}
                    
                    </div>
                ))}
        </div>
    </div>
  )
}

export default Followers
