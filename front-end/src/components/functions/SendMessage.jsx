import React from "react";
import { useState } from "react";
import axios from "axios";
const SendMessage = (props) => {
  const [message, setMessage] = useState("");

  async function sendMessage() {
    if (message.length > 0) {
      try {
        const response = await axios.post(
          "http://localhost:3000/send-message",
          {
            message: message,
            toUsername: props.username,
            convoID: props.id,
          },
          { withCredentials: true }
        );
        if (response.data.Success) {
          alert(`Message Sent to ${props.username}`);
          setMessage("");
          props.reload();
        } else {
          alert(response.data);
          setMessage("");
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Cannot send a message with no characters");
    }
  }
  return (
    <div className="text-center flex">
      <input
        value={message}
        placeholder="Send message"
        className="border-gray-400 border p-1 rounded-md"
        onChange={(e) => setMessage(e.target.value)}
        type="text"
        id=""
      />
      <button
        className="bg-blue-500 text-white p-1 rounded-md"
        onClick={sendMessage}
      >
        Send
      </button>
    </div>
  );
};

export default SendMessage;
