// import React from "react";
import { Avatar, IconButton } from "@material-ui/core";
import { useParams } from "react-router-dom";
import CloseIcon from "@material-ui/icons/Close";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PollIcon from "@mui/icons-material/Poll";
import CreateIcon from "@mui/icons-material/Create";
import PersonPinIcon from "@mui/icons-material/PersonPin";

import "./PollsList.css";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import CurrentPolls from "./polls/CurrentPolls";
import ClosedPolls from "./polls/ClosedPolls";
import CreatePolls from "./polls/CreatePolls";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function PollsList() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const navigate = useNavigate();
  const [attractions, setAttractions] = useState([]);

  const { userId } = useParams(); //userId of charroom/group

  return (
    <div className="pollsList">
      <div className="pollsList__header">
        <div className="pollsList__profile">
          <Avatar
            src={`https://avatars.dicebear.com/api/bottts/${userId}.svg`}
          />
        </div>
        <div className="pollsList__headerInfo">
          <div className="pollsList__title">POLLS</div>
        </div>

        <div className="pollsList__headerRight">
          <IconButton>
            <CloseIcon
              style={{ color: "white" }}
              onClick={() => {
                setAttractions([]);
                navigate(-1);
              }}
            />
          </IconButton>
        </div>
      </div>

      <div className="pollsList__body">
        <div className="pollsList__body__container">
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="icon label tabs example"
            className="polls__tabs"
          >
            <Tab icon={<PollIcon />} label="CURRENT" />
            <Tab icon={<CreateIcon />} label="CREATE NEW" />
            <Tab icon={<PersonPinIcon />} label="CLOSED" />
          </Tabs>

          <TabPanel value={value} index={0}>
            <CurrentPolls />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <CreatePolls />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <ClosedPolls />
          </TabPanel>
        </div>
      </div>

      <div className="pollsList__footer"></div>
    </div>
  );
}

export default PollsList;
