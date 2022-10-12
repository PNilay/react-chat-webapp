import { AttachFile, InsertEmoticon, Mic } from "@material-ui/icons";
import React, { useEffect, useState, useRef } from "react";
import { useStateValue } from "../reactContext/StateProvider";
import { db } from "../../firebase";
import ChatBoxSideBar from "../components/ChatBoxSideBar";
import { addDoc, collection, Timestamp } from "firebase/firestore";
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
import MessageReaction from "./MessageReaction";

import Picker from 'emoji-picker-react';


function ChatboxBody({ messages, userId, sender, setSelected }) {
  const [{ user }, dispatch] = useStateValue(); //information related to current user (sender)
  const [input, setInput] = useState(""); //Variable to stor current typed text message
  const [attractions, setAttractions] = useState([]);

  const bottomRef = useRef(null);

  //Variable for emoji icon button
  const [showPicker, setShowPicker] = useState(false);

  const onEmojiClick = (event, emojiObject) => {
    setInput(prevInput => prevInput + emojiObject.emoji);
    setShowPicker(false);
  };



  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    bottomRef.current?.scrollIntoView();
  }, [messages]);


  useEffect(() => {
    document.title = `You clicked ${showPicker} times`;
  },[showPicker]);

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
      if (!message.isAttraction) {
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
      } else {
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
              }`}
              style={{ background: message.isAttraction ? "lightgray" : "" }}
            >
              <MessageReaction
                message={message}
                handleReaction={handleReaction}
              />

              <span className="chat__name">{message.from_name}</span>
              <div>
              {message.message}
              </div>
              
              <span className="chat__timestamp">
                {new Date(message.timestamp?.toDate()).toUTCString()}
              </span>
            </p>
          ))}

          <div ref={bottomRef}/>
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

      {showPicker && <Picker
          pickerStyle={{ width: '100%' }}
          onEmojiClick={onEmojiClick} />}

      <div className="chat__footer">
        <InsertEmoticon  onClick={() => setShowPicker(val => !val)}/>
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
        {/* <Mic /> */}
        <div className="mic" style={{width: '44px'}}></div>
      </div>
    </>
  );
}

export default ChatboxBody;
