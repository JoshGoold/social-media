import axios from 'axios'
import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const YourGroups = ({user}) => {
  const [groups, setGroups] = useState([])
  const nav = useNavigate()
  async function getGroups(){
    try {
        const response = await axios.get(`http://localhost:3000/your-groups`,{withCredentials: true})
        if(response.data.Success){
            setGroups(response.data.groups)
        } else{
            alert(response.data.Message)
            console.log(response.data.message)
        }
    } catch (error) {
        console.error(`Server Error --> ${error}`)
    }
}
useEffect(()=>{
  getGroups()
},[])

  return (
    <div>
       {groups.length > 0 ? (
                <div className='w-[80%] flex flex-col gap-3 ml-auto mr-auto'>
                    {groups.map((group, index)=>(
                        <div onClick={()=> nav(`/dashboard/${user}/groups/${group.groupName}/${String(group._id)}`)} key={index} className="bg-white p-3 cursor-pointer rounded-md">
                            <div className="flex gap-2 my-2 items-center">
                            <img src={`http://localhost:3000${group.groupProfilePicture}`} height={100} width={100}/>
                            <h1 className='font-bold text-2xl'>{group.groupName}</h1>
                            </div>
                            <p className='my-2'>{group.groupDescription}</p>
                            
                            <ul className='flex justify-between'>
                                <li>{group?.participants?.length || 0}/{group.memberCount} Members</li>
                                <li>{group.groupAccess}</li>
                            </ul>
                            
                        </div>
                    ))}

                </div>
        ) : (<p className='text-white text-center mt-10'>No Groups found. Join one now!</p>)}
    </div>
  )
}

export default YourGroups
