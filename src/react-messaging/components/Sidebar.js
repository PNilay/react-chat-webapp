import React from "react";
import "./Sidebar.css";
import { Avatar, IconButton } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { SearchOutlined } from "@material-ui/icons";
import { useStateValue } from "../reactContext/StateProvider";
import SidebarUser from "./SidebarUser";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { signOut } from "firebase/auth";
import {
  updateDoc,
  doc,
  onSnapshot,
  collection,
  query,
  where,
} from "firebase/firestore";
import { actionTypes } from "../reactContext/Reducer";
import { useNavigate } from "react-router-dom";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import SidebarGroup from "./SidebarGroup";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import GroupsIcon from "@mui/icons-material/Groups";

function Sidebar() {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);

  const [searchVal, setSearchVal] = useState("");

  const [{ user }, dispatch] = useStateValue();
  const navigate = useNavigate();

  const [value, setValue] = React.useState(0);

  useEffect(() => {
    const usersRef = collection(db, "users");

    const q = query(usersRef, where("uid", "not-in", [user.uid]));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUsers(users);
    });

    const groupRef = collection(db, "groups");
    const g = query(
      groupRef,
      where("members", "array-contains-any", [user.uid])
    );

    const unsubscribeGroup = onSnapshot(g, (querySnapshot) => {
      let groups_list = [];
      querySnapshot.forEach((doc) => {
        groups_list.push(doc.data());
      });
      setGroups(groups_list);
    });

    return () => {
      unsubscribe();
      unsubscribeGroup();
    };
  }, []);


  const sign_Out = async () => {
    await updateDoc(doc(db, "users", user.uid), {
      isOnline: false,
    });
    await signOut(auth);

    dispatch({
      type: actionTypes.LOGOUT_USER,
      user: null,
    });
    navigate("/login");
  };

  const add_Group = () => {
    navigate("/add_group");
  };

  const handleChange = (event, newValue) => {
    console.log("new values: ", newValue);
    setValue(newValue);
    // setIsChat()
  };

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar
          src={`https://avatars.dicebear.com/api/bottts/${user.uid}.svg`}
        />{" "}
        <div className="sidebar__header__right">
          <IconButton onClick={add_Group}>
            <GroupAddIcon />
          </IconButton>
          <IconButton onClick={sign_Out}>
            <ExitToAppIcon />
          </IconButton>
        </div>
      </div>

      <div className="sidebar__search">
        <div className="sidebar__search__box">
          <SearchOutlined />
          <input
            type="text"
            placeholder="Search or start new chat"
            onChange={(event) => setSearchVal(event.target.value)}
            value={searchVal}
          />
        </div>
      </div>

      <div>
        <Tabs value={value} onChange={handleChange} className="polls__tabs">
          <Tab icon={<ChatIcon />} label="Chats" />
          <Tab icon={<GroupsIcon />} label="Groups" />
        </Tabs>
      </div>

      <div
        className="sidebar__users"
        style={{ display: value == 0 ? "block" : "none" }}
      >
        {/* <SidebarUser addNewChat /> */}
        {users
          .filter((val) => {
            if (searchVal == "") {
              return val;
            } else if (
              val.name.toLowerCase().includes(searchVal.toLowerCase())
            ) {
              return val;
            }
          })
          .map((userlist) => (
            <SidebarUser
              key={userlist.uid}
              id={userlist.uid}
              userl={userlist}
              search={searchVal != ""}
            />
          ))}
      </div>

      <div
        className="sidebar__users"
        style={{ display: value != 0 ? "block" : "none" }}
      >
        {groups
          .filter((val) => {
            if (searchVal == "") {
              return val;
            } else if (
              val.groupName.toLowerCase().includes(searchVal.toLowerCase())
            ) {
              return val;
            }
          })
          .map((userlist, index) => (
            <SidebarGroup
              key={index}
              id={userlist.uid}
              userl={userlist}
              search={searchVal != ""}
            />
          ))}
      </div>
    </div>
  );
}

export default Sidebar;
