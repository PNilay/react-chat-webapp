import { AttachFile, InsertEmoticon, Mic } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useStateValue } from "../reactContext/StateProvider";
import { db } from "../../firebase";
import ChatBoxSideBar from "../components/ChatBoxSideBar";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import AddLocationIcon from "@material-ui/icons/AddLocation";
import {
  setDoc,
  onSnapshot,
  arrayUnion,
  arrayRemove,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

// import AddLocationIcon from '@mui/icons-material/AddLocation';

function ChatboxBody({ messages, userId, sender, setSelected }) {
  const [{ user }, dispatch] = useStateValue(); //information related to current user (sender)
  const [input, setInput] = useState(""); //Variable to stor current typed text message
  const [attractions, setAttractions] = useState([]);

  useEffect(() => {
    const usersRef = collection(db, "attractions");

    const q = query(
      usersRef,
      where(
        "uid",
        "==",
        user.uid > userId ? `${user.uid + userId}` : `${userId + user.uid}`
      )
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let attraction = [];
      querySnapshot.forEach((doc) => {
        attraction.push(doc.data());
      });
      if (attraction.length > 0) {
        setAttractions(attraction?.[0].attrlist);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleReaction = async (message, icon) => {
    const combined_id =
      user.uid > userId ? `${user.uid + userId}` : `${userId + user.uid}`;

    const citiesRef = collection(db, "messages", combined_id, "chat");

    const q = query(
      citiesRef,
      where("timestamp", "==", message.timestamp),
      where("from", "==", message.from)
    );

    const querySnapshot = await getDocs(q);

    const msgRefId = querySnapshot.docs[0].id;

    if (icon != "➕") {
      await updateDoc(doc(db, "messages", combined_id, "chat", msgRefId), {
        reaction: icon != message.reaction ? icon : "",
      });
    } else {
      const combined_id =
          user.uid > userId ? `${user.uid + userId}` : `${userId + user.uid}`;
      if (icon != message.isAttraction) {
        if (attractions.length == 0) {
          const doc_ref = await setDoc(doc(db, "attractions", combined_id), {
            uid: combined_id,
            attrlist: [message.message],
            createdAt: Timestamp.fromDate(new Date()),
            updatedAt: Timestamp.fromDate(new Date()),
          });
        } else {
          await updateDoc(doc(db, "attractions", combined_id), {
            attrlist: arrayUnion(message.message),
            updatedAt: Timestamp.fromDate(new Date()),
          });
        }
      }else{
        await updateDoc(doc(db, "attractions", combined_id), {
          attrlist: arrayRemove(message.message),
          updatedAt: Timestamp.fromDate(new Date()),
        });
      }

      await updateDoc(doc(db, "messages", combined_id, "chat", msgRefId), {
        isAttraction: !message.isAttraction,
      });
    }
  };

  // const addAttraction = async (input) => {
  //   const combined_id =
  //     user.uid > userId ? `${user.uid + userId}` : `${userId + user.uid}`;

  //   if (attractions.length == 0) {
  //     const doc_ref = await setDoc(doc(db, "attractions", combined_id), {
  //       uid: combined_id,
  //       attrlist: [input],
  //       createdAt: Timestamp.fromDate(new Date()),
  //       updatedAt: Timestamp.fromDate(new Date()),
  //     });
  //   } else {
  //     await updateDoc(doc(db, "attractions", combined_id), {
  //       attrlist: arrayUnion(input),
  //       updatedAt: Timestamp.fromDate(new Date()),
  //     });
  //   }
  // };

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
      isAttraction: false,
    });
    setInput("");
  };

  return (
    <>
      <div className="chat__body">
        <div className="chat__body__msgs">
          {messages.map((message) => (
            <p
              className={`chat__message ${
                message.to == userId && "chat__reciver"
              }`} style={{background: message.isAttraction ? "lightgray" : ""}}
            >
              <span className="chat__reaction">
                <span
                  className="chat__reaction__icon"
                  onClick={() => handleReaction(message, "👍")}
                >
                  👍
                </span>
                <span
                  className="chat__reaction__icon"
                  onClick={() => handleReaction(message, "😍")}
                >
                  😍
                </span>
                <span
                  className="chat__reaction__icon"
                  onClick={() => handleReaction(message, "😆")}
                >
                  😆
                </span>
                <span
                  className="chat__reaction__icon"
                  onClick={() => handleReaction(message, "😲")}
                >
                  😲
                </span>
                <span
                  className="chat__reaction__icon"
                  onClick={() => handleReaction(message, "🙁")}
                >
                  🙁
                </span>
                <span
                  className="chat__reaction__icon"
                  onClick={() => handleReaction(message, "😡")}
                >
                  😡
                </span>
                <span className="chat__reaction__icon">|</span>
                <span
                  className="chat__reaction__icon"
                  onClick={() => handleReaction(message, "➕")}
                >
                  ➕
                </span>
              </span>

              <span
                className="chat__user_reaction"
                style={{ display: message.reaction != "" ? "block" : "none" }}
              >
                {message.reaction}
              </span>

              <span className="chat__name">{message.from_name}</span>
              {message.message}
              <span className="chat__timestamp">
                {new Date(message.timestamp?.toDate()).toUTCString()}
              </span>
            </p>
          ))}
        </div>

        <div className="chat__body__menu">
          <ChatBoxSideBar
            id={
              user.uid > userId
                ? `${user.uid + userId}`
                : `${userId + user.uid}`
            }
          />
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
    </>
  );
}

export default ChatboxBody;
