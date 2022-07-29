// import React, { useState } from "react";
import "./AddGroup.css";
import { Avatar, IconButton } from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";
import { SearchOutlined } from "@material-ui/icons";
import { Button } from "@material-ui/core";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { updateDoc, doc, onSnapshot, QuerySnapshot } from "firebase/firestore";
import { collection, query, where } from "firebase/firestore";
import SidebarUser from "./SidebarUser";
import { useStateValue } from "../reactContext/StateProvider";

import GroupSearch from "./GroupSearch";
import CloseIcon from "@material-ui/icons/Close";
import NameTag from "./NameTag";
import { addDoc, Timestamp } from "firebase/firestore";


function AddGroup() {
  const [groupName, setGroupName] = useState("");
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState("");
  const [users, setUsers] = useState([]);
  const [{ user }, dispatch] = useStateValue();

  const [members, setMembers] = useState([]);
  const [error, setError] = useState();

  const addMember = (name) => {
    const newmem = members.filter((mem) => mem["uid"] !== name.uid);
    setError("");

    if (newmem.length < members.length) {
      setMembers(newmem);
    } else {
      setMembers([...members, name]);
    }
  };

  const handleChange = (e) => {
    setGroupName(e.target.value);
    setError("");
  };

  const createGroup = async () => {
    if (groupName == "") {
      setError("Please provide group name!");
    } else if (members.length < 2) {
      setError("At least two members are required to create group!");
    } else {
      try {
        await addDoc(collection(db, "groups"), {
          groupName,
          members:members.map((user) => user.uid),
          createdAt: Timestamp.fromDate(new Date()),
        });

        setMembers([]);
        setError("");
        setGroupName("");
        navigate("/");
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(errorMessage);
      }
    }
  };

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

  return (
    <div className="createGroup">
      <div className="createGroup__header">
        <div className="createGroup__headerInfo">
          <div className="createGroup__title">CREATE NEW GROUP</div>
        </div>

        <div className="createGroup__headerRight">
          <IconButton>
            <CloseIcon style={{ color: "white" }} onClick={() => navigate('/')}/>
          </IconButton>
        </div>
      </div>

      <div className="createGroup__body">
        <div className="createGroup__container">
          <label htmlFor="name" className="form__label">
            Group Name
          </label>
          <div className="input__box">
            <input
              type="text"
              name="name"
              placeholder="Group Name"
              value={groupName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="createGroup__members">
          <div className="addmembers__label">Add Members </div>
        </div>

        <div className="display_selected_members">
          {members.map((userlist) => (
            <NameTag name={userlist.name} />
          ))}
        </div>

        {error ? <p className="error">{error}</p> : null}

        <div className="createGroup__search__box">
          <SearchOutlined />
          <input
            type="text"
            placeholder="Search to add group members"
            onChange={(event) => setSearchVal(event.target.value)}
            value={searchVal}
          />
        </div>

        <div className="createGroup__searchList">
          {users
            .filter((val) => {
              if (
                searchVal == "" ||
                val.name.toLowerCase().includes(searchVal.toLowerCase())
              ) {
                return val;
              }
            })
            .map((userlist) => (
              <GroupSearch
                key={userlist.uid}
                id={userlist.uid}
                userl={userlist}
                handleAdd={addMember}
              />
            ))}
        </div>
      </div>

      <div className="createGroup__footer">
        <div className="createGroup__btn__container">
          <Button type="submit" onClick={createGroup}>
            {"Create Group"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddGroup;
