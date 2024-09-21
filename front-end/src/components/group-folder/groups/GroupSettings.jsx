import React from 'react'
import axios from 'axios';
import { useState, useEffect } from 'react';

const GroupSettings = ({groupid, getData}) => {
    const [file, setFile] = useState("");
    const [state, setState] = useState(false);
  
    async function changePicture() {
      try {
        const formData = new FormData();
        formData.append("img", file);
        formData.append("groupid", groupid)
  
        const response = await axios.post(
          "http://localhost:3000/new-group-profilepicture",
          formData,
          
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
  
        if (response.data.Success) {
          alert(response.data.Message);
            getData()
        } else {
          alert(response.data.Message);
        }
      } catch (error) {
        console.error(error);
      }
    }
  return (
    <div className='text-white'>
        <button
            title="Change Profile Picture"
            onClick={() => setState(!state)}
            className='bg-blue-500 rounded-md p-2'
          >
            Change Profile Picture
          </button>
          {state && (
            <div className="bg-white p-2 ">
              <h1 className="text-black font-thin">Profile Picture Change</h1>
              <input
                className="text-sm text-black"
                onChange={(e) => setFile(e.target.files[0])}
                placeholder="Change Profile picture"
                type="file"
                title="Update profile picture"
              />
              <button
                className="bg-blue-500 p-2 rounded-md"
                onClick={() => changePicture()}
              >
                Submit
              </button>
            </div>
          )}
      
    </div>
  )
}

export default GroupSettings
