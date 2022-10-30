// import React from "react";
import { Avatar, IconButton } from "@material-ui/core";
import { useParams } from "react-router-dom";
import CloseIcon from "@material-ui/icons/Close";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PollIcon from "@mui/icons-material/Poll";
import CreateIcon from "@mui/icons-material/Create";
import PersonPinIcon from "@mui/icons-material/PersonPin";

import "./PollsList.css";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import CurrentPolls from "./polls/CurrentPolls";
import ClosedPolls from "./polls/ClosedPolls";
import CreatePolls from "./polls/CreatePolls";
import { useStateValue } from "../reactContext/StateProvider";
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

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function PollsList() {
  const [value, setValue] = React.useState(0);
  const [{ user }, dispatch] = useStateValue(); //information related to current user (sender)
  const [name, setName] = useState("");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const navigate = useNavigate();
  const [attractions, setAttractions] = useState([]);

  const { userId } = useParams(); //userId of charroom/group

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

  return (
    <div className="pollsList">
      <div className="pollsList__header">
        <div className="pollsList__profile">
          <Avatar
            src={`https://avatars.dicebear.com/api/bottts/${userId.replace(
              user.uid,
              ""
            )}.svg`}
          />
        </div>
        <div className="pollsList__headerInfo">
          <div className="pollsList__title">POLLS</div>
          <div className="attractionList__title">
            <b>{name}</b>
          </div>
        </div>

        <div className="pollsList__headerRight">
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

      <div className="pollsList__body">
        <div className="pollsList__body__container">
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="icon label tabs example"
            className="polls__tabs"
          >
            <Tab icon={<PollIcon />} label="CURRENT" />
            <Tab icon={<CreateIcon />} label="CREATE NEW2" />
            <Tab icon={<PersonPinIcon />} label="CLOSED" />
          </Tabs>

          <TabPanel value={value} index={0}>
            <CurrentPolls />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <CreatePolls />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <ClosedPolls />
          </TabPanel>
        </div>
      </div>

      <div className="pollsList__footer"></div>
    </div>
  );
}

export default PollsList;
