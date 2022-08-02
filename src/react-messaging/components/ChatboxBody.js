import { AttachFile, InsertEmoticon, Mic } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useStateValue } from "../reactContext/StateProvider";
import { db } from "../../firebase";
import ChatBoxSideBar from "../components/ChatBoxSideBar";
import { addDoc, collection, Timestamp } from "firebase/firestore";

function ChatboxBody({ messages, userId, sender, setSelected }) {
  const [{ user }, dispatch] = useStateValue(); //information related to current user (sender)
  const [input, setInput] = useState(""); //Variable to stor current typed text message

  const sendMessage = async (e) => {
    e.preventDefault();

    const combined_id =
      user.uid > userId ? `${user.uid + userId}` : `${userId + user.uid}`;

    await addDoc(collection(db, "messages", combined_id, "chat"), {
      message: input,
      from: user.uid,
      from_name: sender.name,
      to: userId,
      timestamp: Timestamp.fromDate(new Date()),
    });
    setInput("");
  };

  return (
    <div className="chatbox__body">
      <div className="chat__body">
        <div className="chat__body__msgs">
          {messages.map((message) => (
            <p
              className={`chat__message ${
                message.to == userId && "chat__reciver"
              }`}
            >
              <span className="chat__name">{message.from_name}</span>
              {message.message}
              <span className="chat__timestamp">
                {new Date(message.timestamp?.toDate()).toUTCString()}
              </span>
            </p>
          ))}
        </div>

        <div className="chat__body__menu">
          <ChatBoxSideBar id={userId} setSelected={setSelected}/>
        </div>
      </div>

      <div className="chat__footer">
        <InsertEmoticon />
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Type a message"
          />
          <button type="submit" onClick={sendMessage}>
            Send a Message
          </button>
        </form>
        <Mic />
      </div>
    </div>
  );
}

export default ChatboxBody;
