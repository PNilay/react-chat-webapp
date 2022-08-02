import React from "react";
import "./ChatBoxSideBar.css";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
// import AttractionsIcon from "@material-ui/icons/Attractions";
import PollIcon from "@material-ui/icons/Poll";
import EventIcon from "@material-ui/icons/Event";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import PeopleIcon from "@material-ui/icons/People";

import { Avatar, IconButton } from "@material-ui/core";
import { useNavigate } from "react-router-dom";


function ChatBoxSideBar({id, setSelected}) {
  const navigate = useNavigate();

  return (
    <div className="chat__sidebar">

      <div className="chat__sidebarMenu">
        <ul className="chat__navList">
          <li className="chat__navList__Link">
            <IconButton>
              <MenuOpenIcon />
            </IconButton>

          </li>
          <li className="chat__navList__Link">
            <IconButton>
              <PollIcon />
            </IconButton>

          </li>

          <li className="chat__navList__Link">
            <IconButton>
              <EventIcon />
            </IconButton>

          </li>

          <li className="chat__navList__Link">
            <IconButton onClick={() => setSelected("member")}>
              <PeopleIcon />
            </IconButton>
          </li>
        </ul>
      </div>

      {/* <div className="chat__sidebar__footer">
      <IconButton>
              <DeleteForeverIcon />
            </IconButton>
      </div> */}
    </div>
  );
}

export default ChatBoxSideBar;
