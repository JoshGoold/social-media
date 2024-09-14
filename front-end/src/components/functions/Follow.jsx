import React from 'react'
import axios from 'axios'
import { useState } from 'react'

const Follow = (props) => {

    async function follow(){
        if(!props.followState){
        try {
            const response = await axios.get(`http://localhost:3000/follow?username=${props.username}`,{withCredentials:true})
            if(response.data.Success){
                alert(response.data.Message)
                props.handleUserProfile()
            } else{
                alert(response.data)
            }
        } catch (error) {
            console.error(error)
        }
        }
    }

  return (
    <div className='my-3'>
      <button onClick={follow} className='bg-blue-500 rounded-md p-1 w-full text-white px-10'>{props.followState ? "Following" : "Follow"}</button>
    </div>
  )
}

export default Follow