import React from "react";
import { useState, useContext } from "react";
import axios from "axios";
import UserContext from "../../CookieContext";

const CreateConversation = (props) => {
  const { handleUserConversations, user } = useContext(UserContext);

  const [state, setState] = useState(false);
  const [message, setMessage] = useState("");

  async function createConversation() {
    try {
      if (message.length > 0) {
        const response = await axios.post(
          "http://localhost:3000/create-conversation",
          {
            toUsername: props.username,
            message: message,
          },
          { withCredentials: true }
        );
        if (response.data.Success) {
          alert("Conversation created successfully");
          handleUserConversations(user.username);
          setState(false);
        } else {
          alert(response.data);
        }
      } else {
        alert("You must send a message");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      {!state && (
        <button
          className="bg-purple-500 rounded-md py-1 w-full text-white px-10"
          onClick={() => setState(true)}
        >
          Direct Message
        </button>
      )}
      {state && (
        <div className="">
          <input
            className="border-gray-400 border rounded-md p-2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            placeholder="Send message"
          />
          <button
            className="bg-purple-500 p-2 rounded-md text-white"
            onClick={createConversation}
            title="Send Message"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateConversation;
