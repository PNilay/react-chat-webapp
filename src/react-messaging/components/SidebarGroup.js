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

  return (
    <Link to={`/group/${id}`}>
      <div className="sidebar_user">
        {/* <Avatar src={`https://avatars.dicebear.com/api/avataaars/${id}.svg`} /> */}
        <Avatar src={`https://avatars.dicebear.com/api/bottts/${id}.svg`} />
        <div className="sidevaruser__info">
          <h2>{userl.groupName}</h2>
        </div>
      </div>
    </Link>
  )
}

export default SidebarUser;
