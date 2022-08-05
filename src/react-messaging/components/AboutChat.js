import React from 'react'
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Avatar } from "@material-ui/core";

function AboutChat() {

    const { userId } = useParams(); //userId of Reciver


  return (
    <div className="profile__page">
      <div className="profile__header">
      <Avatar src={`https://avatars.dicebear.com/api/bottts/${userId}.svg`} />
      <div>Name</div>
      </div>
    </div>
  )
}

export default AboutChat;