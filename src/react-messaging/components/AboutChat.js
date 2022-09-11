import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Avatar, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import "./AboutChat.css";
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
import React, { useEffect, useState } from "react";

function AboutChat() {
  const { userId } = useParams(); //userId of Reciver
  const navigate = useNavigate();
  const [{ user }, dispatch] = useStateValue(); //information related to current user (sender)

  const [chatName, setChatName] = useState("");
  const [messages, setMessages] = useState([]);
  const [sender, setSender] = useState();

  const [userName, setUserName] = useState();
  const [groupMembers, setGroupMembers] = useState();

  const [isGroup, setIsGroup] = useState(false);

  useEffect(() => {
    if (userId != "") {
      if (userId != userId.replace(user.uid, "")) {
        setIsGroup(false);

        const senderRef = collection(db, "users");

        const s = query(
          senderRef,
          where("uid", "==", userId.replace(user.uid, ""))
        );

        onSnapshot(s, (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const n = doc.data();
            setUserName(n);
          });
        });

        const messgaesRef = collection(db, "messages", userId, "chat");

        const q2 = query(messgaesRef, orderBy("timestamp", "asc"));

        onSnapshot(q2, (querySnapshot) => {
          let msgs = [];
          querySnapshot.forEach((doc) => {
            msgs.push(doc.data());
          });
          setMessages(msgs);
        });
      } else {
        setIsGroup(true);
        const usersRef = collection(db, "groups");

        const q = query(usersRef, where("uid", "==", userId));

        let d = "";
        onSnapshot(q, (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            d = doc.data();
            setUserName(doc.data());
          });
        });

        console.log("username: ", d);

        // const senderRef = collection(db, "users");

        // const s = query(
        //   senderRef,
        //   where("uid", "in", userName.members)
        // );

        // onSnapshot(s, (querySnapshot) => {
        //   const members = [];
        //   querySnapshot.forEach((doc) => {
        //     members.push(doc.data());
        //   });

        //   console.log("Members: ", members);
        // });
      }
    }
  }, [userId]);

  useEffect(() => {
    if (isGroup && userName != undefined) {
      console.log("Group and not undefined", userName.members);
      const senderRef = collection(db, "users");

      const s = query(senderRef, where("uid", "in", userName.members));

      onSnapshot(s, (querySnapshot) => {
        const members = [];
        querySnapshot.forEach((doc) => {
          members.push(doc.data());
        });
        setGroupMembers(members);
        // console.log("Members: ", members);
      });
    }
  }, [userName]);

  useEffect(() => {
    console.log("Group Members: ", groupMembers);
  }, [groupMembers]);

  return (
    <div className="profile__page">
      <div className="profile__page__header">
        <div className="pollsList__headerInfo">
          <div className="profile__page__title">
            {isGroup ? "Group Info" : "Contact Info"}
          </div>
        </div>

        <div className="pollsList__headerRight">
          <IconButton>
            <CloseIcon
              style={{ color: "white" }}
              onClick={() => {
                navigate(-1);
              }}
            />
          </IconButton>
        </div>
      </div>

      <div className="profile__body">
        <div className="aboutChat__avatar">
          <Avatar
            src={`https://avatars.dicebear.com/api/bottts/${userId.replace(
              user.uid,
              ""
            )}.svg`}
            fontSize="large"
          />
        </div>

        <div className="aboutChat__info">
          <div className="aboutChat__info_name">
            {isGroup ? userName?.groupName : userName?.name}
          </div>
          <div className="aboutChat__info_email">
            {isGroup
              ? userName?.members?.length + " Participants"
              : userName?.email}
          </div>
          {isGroup ? (
            <div className="aboutChat__info_lastSeen">
              Group Created At{" "}
              {new Date(userName?.createdAt?.toDate())?.toUTCString()}
            </div>
          ) : (
            <div className="aboutChat__info_lastSeen">
              Last seen at : {"  "}
              {messages.length > 0
                ? new Date(
                    messages[messages.length - 1]?.timestamp?.toDate()
                  )?.toUTCString()
                : "...."}
            </div>
          )}
        </div>
      </div>

      {isGroup ? (
        <div className="profile__group_members">
          <div className="profile_group_members_title">Group Members</div>
          {isGroup
            ? groupMembers?.map((mem) => (
                <div className="profile__members">
                  <div className="profile_member_name">{mem.name}</div>
                  <div className="profile_member_email">{mem?.email}</div>
                </div>
              ))
            : null}
        </div>
      ) : null}
    </div>
  );
}

export default AboutChat;
