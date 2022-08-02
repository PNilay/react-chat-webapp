import React from 'react'
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

function AboutChat() {

    const { userId } = useParams(); //userId of Reciver


  return (
    <div>
      About Chart {userId}
    </div>
  )
}

export default AboutChat;