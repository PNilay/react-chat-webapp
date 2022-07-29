import { useEffect, useState } from "react";
import "./GroupSearch.css";
import { Avatar, IconButton } from "@material-ui/core";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
// import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';


function GroupSearch({ id, userl, handleAdd }) {
  const [isAdd, setIsAdd] = useState(true);
  return (
    <div>
      <div className="GroupSearch_user">
        <div className="groupSearch__user__name">
          {/* <Avatar src={`https://avatars.dicebear.com/api/avataaars/${id}.svg`} /> */}
          <Avatar src={`https://avatars.dicebear.com/api/bottts/${id}.svg`} />
          <div className="GroupSearch_username">
            {userl.name}
            <div className="GroupSearch__email">{userl.email}</div>
          </div>
        </div>

        <div className="groupSearch__userAdd">
          <IconButton
            style={{ color: "#061f3a" }}
            onClick={() => {
              handleAdd(userl);
              setIsAdd(!isAdd);
            }}
          >
            {isAdd ? (<PersonAddIcon style={{color:"green"}}/>): (<RemoveCircleOutlineIcon style={{color:"red"}}/>)}
          </IconButton>
        </div>
      </div>
    </div>
  );
}

export default GroupSearch;
