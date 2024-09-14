import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useContext } from 'react'
import UserContext from '../CookieContext.jsx'
import Conversations from './dashboard-user/Conversations.jsx'
import ProfileHead from './dashboard-user/ProfileHead.jsx'
import Letter from './dashboard-user/Letter.jsx'
import Post from './dashboard-user/Post.jsx'
import Followers from './dashboard-user/Followers.jsx'
import Following from './dashboard-user/Following.jsx'
import Search from './functions/Search.jsx'
import Logout from './registry/Logout.jsx'
import pic from '../assets/defaultpic.png'
import Sidepanel from './dashboard-user/Sidepanel.jsx'
import { useParams } from 'react-router-dom'

const Dashboard = () => {

    const {user} = useContext(UserContext)

    const {username }= useParams()

    const [userData, setUserData] = useState({
        username: "",
        email: "",
        conversations: [],
        posts: [],
        letters: [],
        profilepic: pic,
        followers: [],
        following: []
    })

    const handleUserProfile = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/user-profile?username=${username}`, {
                withCredentials: true
            })

            if (response.data.Success) {
                setUserData((prevState) => ({
                    ...prevState,
                    username: response.data.user.username,
                    email: response.data.user.email,
                    posts: response.data.user.posts,
                    letters: response.data.user.letters,
                    profilepic: response.data.user.profilepic,
                    followers: response.data.user.followers,
                    following: response.data.user.following
                }))
            } else {
                alert("An error occurred while loading the page")
                console.log(response.data)
            }
        } catch (error) {
            console.error(error)
        }
    }

    // Fetch user profile and conversations
    useEffect(() => {
        handleUserProfile()
    }, [user])

    return (
        <div className='flex  h-screen'>
            <div className="flex-2">
                <Sidepanel userData={userData} setUserData={setUserData} user={user}/>
                </div>
                <div className="p-2 overflow-scroll flex w-full flex-col items-center">
                <ProfileHead userData={userData} setUserData={setUserData} handleUserProfile={handleUserProfile} user={user}/>
                <div className="flex w-full gap-2 mt-5">
                <div className="shadow-md rounded-lg bg-opacity-10  bg-white w-full p-2">
                        <h1 className='font-thin text-white text-2xl'>Letters</h1>
                    </div>
                    <div className="shadow-md w-full rounded-lg bg-opacity-10 bg-white p-2">
                        <h1 className='font-thin text-white text-2xl'>Posts</h1>
                    </div> 
                    </div>
                <div className="flex border-t-2 mt-3 border-black w-full">
                    <div className="w-full ">
                <Letter userData={userData}  setUserData={setUserData} handleUserProfile={handleUserProfile} user={user}/>
                </div>
                <div className="w-full  ">
                <Post userData={userData}  setUserData={setUserData} handleUserProfile={handleUserProfile} user={user}/></div>
                </div>
            </div>
            
            
        </div>
    )
}

export default Dashboard
