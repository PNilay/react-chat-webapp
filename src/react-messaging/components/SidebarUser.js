import { Avatar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../../firebase";
import "./SidebarUser.css";

function SidebarUser({ id, user, addNewChat }) {
  const [seed, setSeed] = useState("");

  const [messages, setMessages] = useState("");

  // useEffect(() => {
  //   if (id) {
  //     db.collection("rooms")
  //       .doc(id)
  //       .collection("messages")
  //       .orderBy("timestamp", "desc")
  //       .onSnapshot((snapshot) =>
  //         setMessages(snapshot.docs.map((doc) => doc.data()))
  //       );
  //   }
  // },[id]);
  // useEffect(() => {
  //   setSeed(Math.floor(Math.random() * 5000));
  // }, []);

  const createChat = () => {
    const roomName = prompt("Please enter name for chat");

    // if (roomName) {
    //   db.collection("rooms").add({
    //     name: roomName,
    //   });
    // }
  };

  return !addNewChat ? (
    <Link to={`/chat/${id}`}>
    <div className="sidebar_user">
      <Avatar src={`https://avatars.dicebear.com/api/avataaars/${id}.svg`} />
      <div className="sidevaruser__info">
        <h2>{user.name}</h2>
        <p>msg</p>
      </div>
    </div>
    </Link>
  ) : (
    // <Link to={`/chat/${id}`}>
    //   <div className="sidebar_user">
    //     <Avatar src={`https://avatars.dicebear.com/api/avataaars/${id}.svg`} />
    //     <div className="sidevaruser__info">
    //       <h2>{name}</h2>
    //       <p>{messages[0]?.message}</p>
    //     </div>
    //   </div>
    // </Link>
    <div onClick={createChat} className="sidebar_user">
      <h2>Add new Chat</h2>
    </div>
  );
}

export default SidebarUser;
