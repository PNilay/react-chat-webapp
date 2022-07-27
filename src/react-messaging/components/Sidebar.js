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


// Firebase Query:
import { collection, query, where } from "firebase/firestore";


function Sidebar() {
  // const [{}, dispatch] = useStateValue();
  const [users, setUsers] = useState([]);

  const [searchVal, setSearchVal] = useState('');

  const [{ user }, dispatch] = useStateValue();
  const navigate = useNavigate();

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

    return () => {
      unsubscribe();
    };
  }, []);

  // useEffect(() => {
  //   // console.log("Search");
  //   if(searchVal.length > 0){
  //     const usersRef = collection(db, "users");

  //   const q = query(usersRef, where("uid", "not-in", [user.uid]));

  //   let temp = [];

  //   onSnapshot(q, (querySnapshot) => {
  //     querySnapshot.forEach((doc) => {
  //       console.log("S");

  //       temp.push(doc.data());
  //     });
  //   });

  //     let seacrhQuery = searchVal.toLowerCase(); f
  //     for(const key in temp){
  //       console.log(key);
  //     }
  //   }
  //   return () => {
  //     false;
  //   };
  // },[searchVal]);

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

  const add_Group =  () => {
    navigate("/add_group");
  };

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar src={`https://avatars.dicebear.com/api/bottts/${user.uid}.svg`} />{" "}
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
          <input type="text" placeholder="Search or start new chat" onChange={(event) =>setSearchVal(event.target.value)} value={searchVal}/>
        </div>
      </div>

      <div className="sidebar__users">
        <SidebarUser addNewChat />
        {users.filter((val)=>{
          if(searchVal == ""){
            return val;
          }else if(val.name.toLowerCase().includes(searchVal.toLowerCase())){
            return val;
          }
        }).map(userlist =>(
            <SidebarUser key={userlist.uid} id ={userlist.uid} userl = {userlist} search = {searchVal != ""}/>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
