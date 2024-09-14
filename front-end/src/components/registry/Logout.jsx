import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
  const nav = useNavigate()
    // Logout handler
    const handleLogout = () => {
        axios.post("http://localhost:3000/logout",{ withCredentials: true })
            .then((res) => {
                if (res.data.Message === "Success") {
                    nav("/login")
                } else{
                  alert("Error logging out")
                }
            })
            .catch((err) => console.log(err))
    }
  return (
    <div className='mt-3'>
      <button className='bg-white rounded-md p-2' onClick={()=>handleLogout()}>Logout</button>
    </div>
  )
}

export default Logout
