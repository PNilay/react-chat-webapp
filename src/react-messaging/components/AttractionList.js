import { Avatar, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useNavigate } from "react-router-dom";
import "./AttractionList.css";
import AttractionCard from "./AttractionCard";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { updateDoc, doc, onSnapshot, QuerySnapshot } from "firebase/firestore";
import {
  collection,
  query,
  where,
  Timestamp,
  addDoc,
  setDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { Button } from "@material-ui/core";
import { useStateValue } from "../reactContext/StateProvider";
import ChatBoxSideBar from "../components/ChatBoxSideBar";

function AttractionList() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [attractions, setAttractions] = useState([]);
  const [edit, setEdit] = useState("");
  const [update, setUpdate] = useState("");
  const [{ user }, dispatch] = useStateValue(); //information related to current user (sender)
  const [name, setName] = useState("");

  const { userId } = useParams(); //userId of charroom/group

  useEffect(() => {
    const usersRef = collection(db, "attractions");

    const q = query(usersRef, where("uid", "==", userId));

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

  useEffect(() => {
    if (userId.includes(user.uid)) {
      console.log("Singal Chat ");
      // Single chat
      const t = userId.replace(user.uid, "");
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("uid", "in", [user.uid, t]));

      let chatusers = "";

      const name = [];
      onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach(async (doc) => {
          name.push(doc.data());
        });

        const name2 = " " + name[0].name + " & " + name[1].name;

        setName(name2);
      });
    } else {
      // Group Chat
      const usersRef = collection(db, "groups");
      const q = query(usersRef, where("uid", "==", userId));

      onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setName(doc.data().groupName);
        });
      });
    }
  }, []);

  useEffect(() => {
    setEdit(update);
  }, [update]);

  const handleRemove = async (location) => {
    await updateDoc(doc(db, "attractions", userId), {
      attrlist: arrayRemove(location),
      updatedAt: Timestamp.fromDate(new Date()),
    });
  };

  const handleEdit = async () => {
    if (update != edit) {
      await updateDoc(doc(db, "attractions", userId), {
        attrlist: arrayRemove(update),
        updatedAt: Timestamp.fromDate(new Date()),
      });

      if (edit != "") {
        await updateDoc(doc(db, "attractions", userId), {
          attrlist: arrayUnion(edit),
          updatedAt: Timestamp.fromDate(new Date()),
        });
      }
    }

    setUpdate("");
    setEdit("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (attractions.length == 0) {
      const doc_ref = await setDoc(doc(db, "attractions", userId), {
        uid: userId,
        attrlist: [input],
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
      });
    } else {
      await updateDoc(doc(db, "attractions", userId), {
        attrlist: arrayUnion(input),
        updatedAt: Timestamp.fromDate(new Date()),
      });
    }
    setInput("");
  };

  return (
    <div className="attractionList">
      <div className="attractionList__header">
        <div className="attractionList__profile">
          <Avatar
            src={`https://avatars.dicebear.com/api/bottts/${userId.replace(
              user.uid,
              ""
            )}.svg`}
          />
        </div>
        <div className="attractionList__headerInfo">
          <div className="attractionList__title">ATTRACTION LIST</div>
          <div className="attractionList__title">
            <b>{name}</b>
          </div>
        </div>

        <div className="attractionList__headerRight">
          <IconButton>
            <CloseIcon
              style={{ color: "white" }}
              onClick={() => {
                setAttractions([]);
                navigate(-1);
              }}
            />
          </IconButton>
        </div>
      </div>


      <div className="attractionList__body">
        <div className="attractionList__body__container">
          <form className="attractions__form" onSubmit={handleSubmit}>
            <div className="input__box">
              <input
                type="text"
                placeholder="Add Attraction"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="attraction-add"
              />

              <Button className="attraction-Addbtn"> Add </Button>
            </div>
          </form>
          <div
            className="attractions__form"
            style={{ display: update != "" ? "block" : "none" }}
          >
            <div className="input__box">
              <input
                type="text"
                placeholder="Update Attraction"
                value={edit}
                onChange={(e) => setEdit(e.target.value)}
                className="attraction-edit"
              />

              <Button className="attraction-Editbtn" onClick={handleEdit}>
                {" "}
                Update{" "}
              </Button>
            </div>
          </div>

          <div className="attractionList__searchList">
            {attractions.map((location, index) => (
              <AttractionCard
                key={index}
                id={location}
                handleRemove={handleRemove}
                setUpdate={setUpdate}
              />
            ))}
          </div>
        </div>

      </div>

      <div className="attractionList__footer"></div>
    </div>
  );
}

export default AttractionList;
