import React from "react";
import "./Polls.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { updateDoc, doc, onSnapshot, QuerySnapshot } from "firebase/firestore";
import { useStateValue } from "../../reactContext/StateProvider";
import {
  collection,
  query,
  where,
  Timestamp,
  orderBy,
  setDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import ClosedPoll_Card from "./ClosedPoll_Card";

function ClosedPolls() {
  const [{ user }, dispatch] = useStateValue(); //information related to current user (sender)
  const { userId } = useParams(); //userId of charroom/group
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const pollsRef = collection(db, "polls");

    const q = query(pollsRef, where("uid", "==", userId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let current = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().completed_by.includes(user.uid)) {
          current.push(doc.data());
        }
      });

      current.sort((a, b) => b.createdAt - a.createdAt);
      setPolls(current);
    });

    return async () => {
      await unsubscribe();
    };
  }, []);

  const handleSubmit = async (card_index, result) => {
    await updateDoc(
      doc(db, "polls_responce", polls[card_index].polls_responce_id),
      {
        poll_responce: arrayUnion({
          useruid: user.uid,
          response: result,
        }),
        updatedAt: Timestamp.fromDate(new Date()),
      }
    );

    await updateDoc(doc(db, "polls", polls[card_index].polls_responce_id), {
      completed_by: arrayUnion(user.uid),
      updatedAt: Timestamp.fromDate(new Date()),
    });
  };
  return (

    polls.length > 0 ?
    <div>
      <div className="current__poll_list">
        {polls?.map((poll, index) => (
          <ClosedPoll_Card
            poll={poll}
            card_index={index}
            handleSubmit={handleSubmit}
          />
        ))}
      </div>
    </div>
    :
    <div className="currentPoll__card"> No closed polls available</div>
  );
}

export default ClosedPolls;
