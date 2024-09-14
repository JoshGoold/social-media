import React from 'react'
import Followers from './Followers'
import Following from './Following'
import CreateLetter from '../functions/CreateLetter'
import CreatePost from '../functions/CreatePost'
import { useState } from 'react'
import axios from 'axios'

const ProfileHead = (props) => {

  const [file,setFile] = useState("")
  const [state,setState] = useState(false)

  async function changePicture(){
    try {
      const formData = new FormData();
      formData.append("img", file); 

      const response = await axios.post("http://localhost:3000/new-profilepicture",formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            withCredentials: true, 
        })

        if(response.data.Success){
          alert(response.data.Message)
          props.handleUserProfile()
          window.location.reload()
        } else{
          alert(response.data.Message)
        }
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div className='flex flex-col text-white items-center'>
      <div className="">
      <div className="flex flex-col items-center">
        <img className='rounded-full' height={200} width={200} src={`http://localhost:3000${props.userData.profilepic}`} alt="no image" />
        <button title='Change Profile Picture' onClick={()=>setState(!state)}>✏️</button>
        {state &&(
          <div className="bg-white p-2 ">
          <h1 className='text-black font-thin'>Profile Picture Change</h1>
          <input className='text-sm text-black' onChange={(e)=>setFile(e.target.files[0])} placeholder='Change Profile picture' type="file" title='Update profile picture'/>
          <button className='bg-blue-500 p-2 rounded-md' onClick={()=>changePicture()}>Submit</button>
        </div>
        )}
        </div>
      <div className="flex flex-col items-center">
          <h1>{props.userData.username || "N/A"}</h1>
          <h1>{props.userData.email || "N/A"}</h1> 
      </div>
      </div>
          <div className="flex gap-4">
            <Followers userData={props.userData}/>
            <Following userData={props.userData}/>
          </div>
          <div className="flex items-center gap-4">
            <CreateLetter userData={props.userData}  handleUserProfile={props.handleUserProfile} setUserData={props.setUserData} user={props.user}/>
            <CreatePost userData={props.userData}  handleUserProfile={props.handleUserProfile} setUserData={props.setUserData} user={props.user}/>
            </div>    
      
    </div>
  )
}

export default ProfileHead
