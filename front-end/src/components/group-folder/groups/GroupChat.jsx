import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import GroupMessage from "../function/GroupMessage";
import pic from "../../../assets/defaultpic.png";
import CreateGroupConversation from "../function/CreateGroupChat";

const GroupChat = ({groupid, groupData, groupname, getData, setGroupData}) => {
  const [open, setOpen] = useState({
    state: false,
    id: "",
    username: "",
    msgs: [],
  });

  const conversationEndRef = useRef(null);


  const handleGroupConversations = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/group-message-history?groupid=${groupid}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.Success) {
        setGroupData((prevState) => ({
          ...prevState,
          conversations: response.data.convos,
        }));
        console.log(groupData)

      } else {
        console.log(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    handleGroupConversations();
  }, []);

  // Scroll to bottom whenever the component mounts or updates
  useEffect(() => {
    if (conversationEndRef.current) {
      conversationEndRef.current.scrollTop =
        conversationEndRef.current.scrollHeight;
    }
  }, [groupData?.conversations]);

  return (
    <div  className="overflow-y-auto hide-scrollbar">
      <ul>
        <li className="mt-3"><b className="text-white text-thin">Conversations</b></li>
        <li className="flex justify-end"><CreateGroupConversation groupid={groupid} handleGroupConversations={handleGroupConversations}/></li>
        <li className="flex mt-4 flex-col-reverse">
          {groupData.conversations.map((conversation, index) => (
            <div key={index} className="bg-white rounded-md p-1 mb-3">
              <h1
                className="text-center flex flex-col  items-center gap-1 font-bold mb-3"
                onClick={() =>{
                  setOpen((prevState) => ({
                    state: prevState.id !== conversation.convoID || !prevState.state, // Open if different or closed
                    id: conversation.convoID,
                    username: conversation.head,
                    msgs: conversation.msgs,
                  }))}
                }
              >
                <h1 className="p-4 ">{groupname} Chat {Number(index)+1}</h1>
                
                
              </h1>
              <div
                className="bg-white p-1 mb-2 relative max-h-[400px] overflow-y-auto rounded-md"
                ref={conversationEndRef}
                id={conversation.convoID}
                key={index}
              >
                <div className="">
                  {open.state === true &&
                    open.id === conversation.convoID &&
                    open.username === conversation.head && (
                      <div className="">
                        <div className="flex flex-col gap-2">
                          {conversation?.msgs.map((msg, index) => (
                            <h1
                              className={`p-1 hover:-translate-y-1 hover:shadow-lg max-w-[50%] w-auto bg-blue-500 text-white rounded-md ${
                                msg.split(":")[0] === "You"
                                  ? "self-end text-left"
                                  : "self-start text-left"
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
              {open.state === true &&
                open.id === conversation.convoID &&
                open.username === conversation.head && (
                  <div className="flex">
                    <button
                      onClick={() =>
                        setOpen({
                          state: !open.state,
                          id: "",
                          username: "",
                          msgs: [],
                        })
                      }
                    >
                      ❌
                    </button>
                    <GroupMessage
                      reload={handleGroupConversations}
                      id={conversation.convoID}
                      username={groupData.groupCategory}
                    />
                  </div>
                )}
            </div>
          )) || "N/A"}
        </li>
      </ul>
    </div>
  );
};

export default GroupChat;
