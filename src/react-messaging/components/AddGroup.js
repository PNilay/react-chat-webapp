import React, { useState } from "react";
import "./AddGroup.css";
import { Avatar, IconButton } from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";

import CloseIcon from "@material-ui/icons/Close";

function AddGroup() {
  const [groupName, setGroupName] = useState("");
  const navigate = useNavigate();

  const sub = () => {
    console.log("submit");
  };

  return (
    <div className="createGroup">
      <div className="createGroup__header">
        <div className="createGroup__headerInfo">
          <div className="createGroup__title">CREATE NEW GROUP</div>
        </div>

        <div className="createGroup__headerRight">
          <IconButton>
            <CloseIcon style={{color: "white"}}/>
          </IconButton>
        </div>
      </div>

      {/* <div className="createGroup__body">
          <div className="createGroup__text">
            <div className="createGroup__title">REGISTER ACCOUNT</div>
            <form className="createGroup__form" onSubmit={sub}>
              <div className="input__container">
                <label htmlFor="name" className="form__label">
                  Group Name
                </label>
                <div className="input__box">
                  <input
                    type="text"
                    name="name"
                    placeholder="Group Name"
                  />
                </div>
              </div>
            </form>
          </div>
      </div> */}

      {/* <div className="chat__footer">Footer</div> */}
    </div>
  );
}

export default AddGroup;
