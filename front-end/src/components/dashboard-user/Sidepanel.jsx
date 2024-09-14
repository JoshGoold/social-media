import React from 'react'
import Search from '../functions/Search'
import Conversations from './Conversations'
import Logout from '../registry/Logout'

const Sidepanel = (props) => {
  return (
    <div className='flex flex-col bg-white bg-opacity-10 overfolow-y-auto p-3 h-full'>
      <Search/>
      <Conversations userData={props.userData} setUserData={props.setUserData} user={props.user}/>
      <div className="mt-auto">
      <Logout/>
      </div>
    </div>
  )
}

export default Sidepanel
