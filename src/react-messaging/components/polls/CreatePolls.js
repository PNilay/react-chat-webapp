import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import { Button } from "@material-ui/core";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { updateDoc, doc, onSnapshot, QuerySnapshot } from "firebase/firestore";
import AttractionCard from "../AttractionCard";
import { useStateValue } from "../../reactContext/StateProvider";

import {
  collection,
  query,
  where,
  Timestamp,
  addDoc,
  setDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

import "./Polls.css";

function CreatePolls() {
  const [data, setData] = useState({
    poll_type: "",
    msp_option: "",
    question: "",
    options: [],
    error: null,
    loading: false,
  });

  const [{ user }, dispatch] = useStateValue(); //information related to current user (sender)

  const { poll_type, msp_option, question, options, error, loading } = data;

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const [aOption, setAOption] = useState([]);

  const [input, setInput] = useState("");

  const [edit, setEdit] = useState("");
  const [update, setUpdate] = useState("");

  const { userId } = useParams(); //userId of charroom/group

  const [attractions, setAttractions] = useState([]);

  useEffect(() => {
    const usersRef = collection(db, "attractions");

    const q = query(usersRef, where("uid", "==", userId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let attraction = [];
      querySnapshot.forEach((doc) => {
        attraction.push(doc.data());
      });
      if (attraction.length > 0) {
        setAttractions(attraction?.[0].attrlist);
      }
    });

    return async () => {
      await unsubscribe();
    };
  }, []);

  const [ids, setIds] = useState([]);

  // This function will be triggered when a checkbox changes its state
  const selectUser = (event) => {
    const selectedId = parseInt(event.target.value);

    if (ids.includes(selectedId)) {
      const newIds = ids.filter((id) => id !== selectedId);
      setIds(newIds);
    } else {
      const newIds = [...ids];
      newIds.push(selectedId);
      setIds(newIds);
    }
  };

  const addOption = async (e) => {
    e.preventDefault();
    if (aOption.length == 0) {
      setAOption([input]);
    } else {
      setAOption([...aOption, input]);
    }
    setInput("");
  };

  const handleRemove = (name) => {
    setAOption(aOption.filter((item) => item !== name));
  };

  useEffect(() => {
    setEdit(update);
  }, [update]);

  const handleEdit = async (e) => {
    e.preventDefault();

    if (update != edit) {
      const a = aOption.filter((item) => {
        return item !== update;
      });

      if (edit != "") {
        await setAOption([...a, edit]);
      } else {
        await setAOption([...a]);
      }
    }
    setUpdate("");
    setEdit("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("msp option: ", data);

    setData({ ...data, error: null, loading: true });

    if (!poll_type || !question) {
      setData({ ...data, error: "All fields are required!" });
    } else if (aOption.length + ids.length < 2) {
      setData({ ...data, error: "At least two options are required!" });
    } else {
      try {
        const temp = aOption;
        ids.map((id) => temp.push(attractions[id]));

        const poll_ref = await addDoc(collection(db, "polls"), {
          uid: userId,
          poll_type,
          question,
          msp_option,
          options: temp,
          createdAt: Timestamp.fromDate(new Date()),
          createdBy: user.uid,
          completed_by: [],
        });

        await setDoc(doc(db, "polls_responce", poll_ref.id),{
          createdBy: user.uid,
          poll_reference_id: poll_ref.id,
        });


        await updateDoc(doc(db, "polls", poll_ref.id), {
          polls_responce_id: poll_ref.id,
        });

        setData({
          poll_type: "",
          msp_option: "",
          question: "",
          options: "",
          error: null,
          loading: false,
        });

        setAOption([]);
        setIds([]);
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        setData({ ...data, error: errorMessage, loading: false });
      }
    }
  };

  return (
    <div>
      <div className="createPoll__type">
        <FormControl>
          <label
            id="demo-row-radio-buttons-group-label"
            className="poll_question_label"
          >
            Select Type of Poll
          </label>

          <RadioGroup
            row
            name="poll_type"
            value={poll_type}
            onChange={handleChange}
          >
            <FormControlLabel
              value="ssp"
              control={<Radio />}
              label="Single Select Poll"
            />
            <FormControlLabel
              value="msp"
              control={<Radio />}
              label="Multiple Select Poll"
            />
          </RadioGroup>
        </FormControl>

        {poll_type == "msp" ? (
          <div className="poll_question">
            <label for="poll_question1" className="poll_question_label">
              Number of option user allowed to select?
            </label>
            <div className="question_card">
              <TextField
                variant="standard"
                placeholder="3"
                name="msp_option"
                value={msp_option}
                onChange={handleChange}
              />
            </div>
          </div>
        ) : null}

        <div className="poll_question">
          <label for="poll_question" className="poll_question_label">
            Poll Question
          </label>
          <div className="question_card">
            <TextField
              variant="standard"
              placeholder="Where do you want to go for holiday?"
              value={question}
              name="question"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="poll_question">
          <label for="poll_options" className="poll_question_label">
            Poll Options
          </label>

          <div className="input__box">
            <input
              type="text"
              placeholder="Add Custom Option"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="custom-option-add"
            />

            <Button
              className="custom-option-Addbtn"
              onClick={input.length > 0 ? addOption : null}
            >
              {" "}
              Add Option{" "}
            </Button>
          </div>

          <div
            className="attractions__form"
            style={{ display: update != "" ? "block" : "none" }}
          >
            <div className="input__box">
              <input
                type="text"
                placeholder="Update Attraction"
                value={edit}
                onChange={(e) => setEdit(e.target.value)}
                className="attraction-edit"
              />

              <Button className="attraction-Editbtn" onClick={handleEdit}>
                {" "}
                Update{" "}
              </Button>
            </div>
          </div>

          <div className="attractionList__searchList">
            {aOption.map((location, index) => (
              <AttractionCard
                key={index}
                id={location}
                handleRemove={handleRemove}
                setUpdate={setUpdate}
              />
            ))}
          </div>
        </div>

        {attractions.length > 0 ? (
          <div className="attraction_options poll_question">
            <label className="poll_question_label">
              Select poll options from below Attraction list. (optional)
            </label>

            <div className="attractions__checklist">
              {attractions.map((name, index) => {
                return (
                  <span className="toppings-list-item" key={index}>
                    <span className="left-section">
                      <label
                        for={`custom-checkbox-${index}`}
                        className="custom-checkbox"
                      >
                        <input
                          className="custom-checkbox__input"
                          type="checkbox"
                          id={`custom-checkbox-${index}`}
                          name={name}
                          value={index}
                          checked={ids.includes(index) ? true : false}
                          onChange={selectUser}
                        />

                        <div className="custom-checkbox__box"></div>

                        {name}
                      </label>
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
        ) : null}
        {error ? <p className="error">{error}</p> : null}

        <div className="create-poll-submit">
          <div className="btn__container">
            <Button type="submit" onClick={handleSubmit}>
              Create Poll
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePolls;
