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
// import db from "../../firebase";

import firebase from "firebase/compat/app"; //v9
import { useStateValue } from "../reactContext/StateProvider";
import { db } from "../../firebase";
import ChatBoxSideBar from "../components/ChatBoxSideBar";
import {
  addDoc,
  collection,
  setDoc,
  doc,
  Timestamp,
  FieldValue,
  onSnapshot,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";

// import { collection, query, where, getDocs } from "firebase/firestore";

function Chatbox() {
  const [input, setInput] = useState(""); //Variable to stor current typed text message

  //   const [seed, setSeed] = useState("");

  const { userId } = useParams(); //userId of Reciver
  const [{ user }, dispatch] = useStateValue(); //information related to current user (sender)

  const [chatName, setChatName] = useState("");

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (userId) {
      const combined_id =
        user.uid > userId ? `${user.uid + userId}` : `${userId + user.uid}`;
      // db.collection("users")
      //   .doc(userId)
      //   .onSnapshot((snapshot) => setChatName(snapshot.data().name));

      const usersRef = collection(db, "users");

      const q = query(usersRef, where("uid", "in", [userId]));

      onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setChatName(doc.data());
        });
      });

      // db.collection("messages")
      //   .doc(combined_id)
      //   .collection("chat")
      //   .orderBy("timestamp", "asc")
      //   .onSnapshot((snapshot) =>
      //     setMessages(snapshot.docs.map((doc) => doc.data()))
      //   );

      const messgaesRef = collection(db, "messages", combined_id, "chat");

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

    const combined_id =
      user.uid > userId ? `${user.uid + userId}` : `${userId + user.uid}`;

    // db.collection("messages")
    //   .doc(combined_id)
    //   .collection("message")
    //   .add({
    //     message: input,
    //     from: user.uid,
    //     to: userId,
    //     timestamp: Timestamp.fromDate(new Date()),
    //   });

    await addDoc(collection(db, "messages", combined_id, "chat"), {
      message: input,
      from: user.uid,
      to: userId,
      timestamp: Timestamp.fromDate(new Date()),
    });
    console.log(combined_id);
    setInput("");
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar
          src={`https://avatars.dicebear.com/api/avataaars/${userId}.svg`}
        />
        <div className="chat__headerInfo">
          <h3>{chatName.name}</h3>
          <p>
            Last seen {"  "}
            {new Date(
              messages[messages.length - 1]?.timestamp?.toDate()
            ).toUTCString()}
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
                message.to == userId && "chat__reciver"
              }`}
            >
              <span className="chat__name">{message.name}</span>
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
  );
}

export default Chatbox;
