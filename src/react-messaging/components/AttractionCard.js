import React from "react";
import { useEffect, useState } from "react";
import "./GroupSearch.css";
import { Avatar, IconButton } from "@material-ui/core";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import EditIcon from "@material-ui/icons/Edit";

function AttractionCard({ id, handleRemove, setUpdate }) {
  return (
    <div>
      <div className="GroupSearch_user">
        <div className="groupSearch__user__name">
          {/* <Avatar src={`https://avatars.dicebear.com/api/bottts/${id}.svg`} /> */}
          <div className="GroupSearch_username">
            {id}
            {/* <div className="GroupSearch__email">{id}</div> */}
          </div>
        </div>

        <div className="groupSearch__userAdd">
          <IconButton
            onClick={() => {
                setUpdate(id);
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            style={{ color: "#061f3a" }}
            onClick={() => {
              handleRemove(id);
            }}
          >
            <RemoveCircleOutlineIcon style={{ color: "red" }} />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

export default AttractionCard;
