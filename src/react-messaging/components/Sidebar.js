import React from "react";
import "./Sidebar.css";
import { Avatar, IconButton } from "@material-ui/core";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { SearchOutlined } from "@material-ui/icons";
import { useStateValue } from "../reactContext/StateProvider";
import SidebarUser from "./SidebarUser";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { signOut } from "firebase/auth";
import { updateDoc, doc, onSnapshot, QuerySnapshot } from "firebase/firestore";
import { actionTypes } from "../reactContext/Reducer";
import { useNavigate } from "react-router-dom";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import Button from "@mui/material/Button";
import SidebarGroup from "./SidebarGroup";

// Firebase Query:
import { collection, query, where } from "firebase/firestore";

function Sidebar() {
  // const [{}, dispatch] = useStateValue();
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);

  const [searchVal, setSearchVal] = useState("");

  const [{ user }, dispatch] = useStateValue();
  const navigate = useNavigate();

  const [isChat, setIsChat] = useState(false);

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
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
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

      <div className="sidebar__toggle">
        <Button
          variant={isChat ? "contained" : "outlined"}
          className="sidebar__toggle__chats"
          onClick={() => setIsChat(true)}
        >
          Chats
        </Button>
        <Button
          variant={isChat ? "outlined" : "contained"}
          className="sidebar__toggle__groups"
          onClick={() => setIsChat(false)}
        >
          Groups
        </Button>
      </div>

      <div
        className="sidebar__users"
        style={{ display: isChat ? "block" : "none" }}
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
        style={{ display: !isChat ? "block" : "none" }}
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
          .map((userlist,index) => (
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
