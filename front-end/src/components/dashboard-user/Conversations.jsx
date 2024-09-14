import React, { useEffect, useState, useRef, useContext } from 'react'
import axios from 'axios'
import SendMessage from '../functions/SendMessage'
import pic from '../../assets/defaultpic.png'

const Conversations = (props) => {

    const [open, setOpen] = useState({state: false, id: "", username: "", msgs: []})

    const conversationEndRef = useRef(null);


    const handleUserConversations = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/message-history?username=${props.user.username}`, {
                withCredentials: true
            })
            
            if (response.data.Success) {
                props.setUserData((prevState) => ({
                    ...prevState,
                    conversations: response.data.convos
                }))
            } else {
                console.log(response.data)
            }
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(()=>{
        handleUserConversations()
    },[])

    // Scroll to bottom whenever the component mounts or updates
    useEffect(() => {
        if (conversationEndRef.current) {
        conversationEndRef.current.scrollTop = conversationEndRef.current.scrollHeight;
        }
    }, [props.userData?.conversations]);


  return (
    <div>
    <ul>
      <li>
        <b className="text-white text-thin">Conversations</b>
        {props.userData.conversations.map((conversation, index) => (
            <div key={index} className='bg-white rounded-md p-1 mb-3'>
                <h1 className='text-center flex items-center gap-1 font-bold mb-3' onClick={() => setOpen({ state: !open.state, id: conversation.convoID, username: conversation.head, msgs: conversation.msgs })}>
              <img height={50} width={50} src={pic}/><span>{conversation.head}</span>
            </h1>
          <div className="bg-white p-1 mb-2 relative max-h-[400px] overflow-y-auto rounded-md" ref={conversationEndRef} id={conversation.convoID} key={index}>
            
            <div className="">
            {open.state === true && open.id === conversation.convoID && open.username === conversation.head && (
              <div className="">
                <div className="flex flex-col gap-2">
                  {conversation.msgs.map((msg, index) => (
                    <h1
                      className={`p-1 hover:-translate-y-1 hover:shadow-lg max-w-[50%] w-auto bg-blue-500 text-white rounded-md ${
                        msg.split(":")[0] === "You" ? "self-end text-left" : "text-left"
                      }`}
                      key={index}
                    >
                      {msg.split(":")[1]}
                    </h1>
                  ))}
                  
                </div>
              </div>
            )}
          </div>
          
                  </div> 
                   {open.state === true && open.id === conversation.convoID && open.username === conversation.head && (
                    <div className="flex">
                    <button onClick={() => setOpen({ state: !open.state, id: conversation.convoID, username: conversation.head, msgs: conversation.msgs })}>❌</button>
                  <SendMessage reload={handleUserConversations} id={conversation.convoID} username={conversation.head}/>
                  </div>
                  )}
             </div>
        )) || "N/A"}
            
      </li>
    </ul>
  </div>
  

  )
}

export default Conversations
