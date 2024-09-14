import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Register from './components/registry/Register.jsx'
import Login from './components/registry/Login.jsx'
import UserProfile from './components/UserProfile'
import {UserProvider} from './CookieContext.jsx'


const App = () => {

  return (
    <div className="fixed top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]">
    <BrowserRouter>
    <UserProvider>
    <Routes>
      <Route index element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/dashboard/:username" element={<Dashboard/>}/>
      <Route path="/user-profile/:username" element={<UserProfile/>}/>
    </Routes>
    </UserProvider>
    </BrowserRouter>
    </div>
  )
}

export default App
