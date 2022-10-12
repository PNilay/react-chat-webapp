import { Avatar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../../firebase";
import "./SidebarUser.css";
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
import { useStateValue } from "../reactContext/StateProvider";

function SidebarUser({ id, userl, addNewChat, search }) {
  const [seed, setSeed] = useState("");

  const [messages, setMessages] = useState("");
  const [{ user }, dispatch] = useStateValue(); //information related to current user (sender)

  useEffect(() => {
    if (id) {
      const combined_id =
        user.uid > id ? `${user.uid + id}` : `${id + user.uid}`;

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
  }, [id]);

  const createChat = () => {
    const roomName = prompt("Please enter name for chat");
  };

  return !addNewChat ? ((messages[0]?.message != null || search) ? (
    <Link to={`/chat/${id}`}>
      <div className="sidebar_user">
        {/* <Avatar src={`https://avatars.dicebear.com/api/avataaars/${id}.svg`} /> */}
        <Avatar src={`https://avatars.dicebear.com/api/bottts/${id}.svg`} />
        <div className="sidevaruser__info">
          <h2>{userl.name}</h2>
          <p className="sidebar_user_last_msg">{messages[messages.length-1]?.message}</p>
        </div>
      </div>
    </Link>
  ): <></>) : (
    <div onClick={createChat} className="sidebar_user">
      <h2>Add new Chat</h2>
    </div>
  );
}

export default SidebarUser;
