import { Avatar, IconButton } from "@material-ui/core";
import { AttachFile, SearchOutlined } from "@material-ui/icons";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreVert from "@material-ui/icons/MoreVert";
import userEvent from "@testing-library/user-event";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Chatbox.css";
import { useStateValue } from "../reactContext/StateProvider";
import { db } from "../../firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import ChatboxBody from "../components/ChatboxBody";
import { useNavigate } from "react-router-dom";

function Chatbox() {
  const { userId } = useParams(); //userId of Reciver
  const [{ user, loginUser }, dispatch] = useStateValue(); //information related to current user (sender)

  const [chatName, setChatName] = useState("");

  const [messages, setMessages] = useState([]);
  const [sender, setSender] = useState("");

  const [selected, setSelected] = useState("chat");

  const navigate = useNavigate();


  useEffect(() => {
    if (userId) {
      setSelected("chat");
      const combined_id =
        user.uid > userId ? `${user.uid + userId}` : `${userId + user.uid}`;
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("uid", "in", [userId]));
      onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setChatName(doc.data());
        });
      });

      const senderRef = collection(db, "users");

      const s = query(senderRef, where("uid", "==", user.uid));

      onSnapshot(s, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setSender(doc.data());
        });
      });

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

  return (
    <div className="chat">
      <div className="chat__header">
        <div className="chat-back">
          <IconButton onClick={() => navigate(`/`)}>
            <ArrowBackIcon />
          </IconButton>
        </div>

        <Avatar src={`https://avatars.dicebear.com/api/bottts/${userId}.svg`} />

        <div className="chat__headerInfo">
          <h3>{chatName.name}</h3>
          <p>
            Last seen {"  "}
            {messages.length > 0
              ? new Date(
                  messages[messages.length - 1]?.timestamp?.toDate()
                )?.toUTCString()
              : "...."}
          </p>
        </div>

        <div className="chat__headerRight">
          {/* <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton> */}
        </div>
      </div>

      <ChatboxBody
        messages={messages}
        userId={userId}
        sender={sender}
        setSelected={setSelected}
      />
    </div>
  );
}

export default Chatbox;
