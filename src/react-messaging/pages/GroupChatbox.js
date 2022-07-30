import { Avatar, IconButton } from "@material-ui/core";
import {
  AttachFile,
  InsertEmoticon,
  Mic,
  SearchOutlined,
} from "@material-ui/icons";
import MoreVert from "@material-ui/icons/MoreVert";
import userEvent from "@testing-library/user-event";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Chatbox.css";
import firebase from "firebase/compat/app"; //v9
import { useStateValue } from "../reactContext/StateProvider";
import { db } from "../../firebase";
import ChatBoxSideBar from "../components/ChatBoxSideBar";
import {
  addDoc,
  collection,
  getDoc,
  doc,
  Timestamp,
  FieldValue,
  onSnapshot,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";

function GroupChatBox() {
  const { userId } = useParams(); //userId of Reciver
  const [groupName, setGroupName] = useState("");
  const [input, setInput] = useState(""); //Variable to stor current typed text message
  const [{ user }, dispatch] = useStateValue(); //information related to current user (sender)
  const [messages, setMessages] = useState([]);
  const [sender,setSender] = useState("");

  useEffect(() => {
    if (userId) {
      const usersRef = collection(db, "groups");

      const q = query(usersRef, where("uid", "==", userId));

      onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setGroupName(doc.data());
        });
      });


      const senderRef = collection(db, "users");

      const s = query(senderRef, where("uid", "==", user.uid));

      onSnapshot(s, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setSender(doc.data());
        });
      });


      // Fetching message chain from database
      const messgaesRef = collection(db, "messages", userId, "chat");

      const q2 = query(messgaesRef, orderBy("timestamp", "asc"));

      onSnapshot(q2, (querySnapshot) => {
        let msgs = [];
        querySnapshot.forEach((doc) => {
          msgs.push(doc.data());
        });
        setMessages(msgs);
      });
    }
  }, [userId]);

  const sendMessage = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "messages", userId, "chat"), {
      message: input,
      from: user.uid,
      from_name:sender.name,
      to: userId,
      timestamp: Timestamp.fromDate(new Date()),
      isGroup: true,
    });
    setInput("");
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={`https://avatars.dicebear.com/api/bottts/${userId}.svg`} />

        <div className="chat__headerInfo">
          <h3>{groupName.groupName}</h3>
          <p>
            Group {" - "}
            {groupName?.members?.length} {"  "} participants
          </p>
        </div>

        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>

      <div className="chat__body">
        <div className="chat__body__msgs">
          {messages.map((message) => (
            <p
              className={`chat__message ${
                message.from == user.uid && "chat__reciver"
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
          <ChatBoxSideBar />
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

      {/* <ChatBoxSideBar /> */}
    </div>
  )
}

export default GroupChatBox;
