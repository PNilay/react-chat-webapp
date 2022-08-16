import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./CurrentPoll_Card.css";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Button } from "@material-ui/core";

function CurrentPoll_Card({ poll, card_index, handleSubmit }) {
  const [options_list, SetOptions_list] = useState([]);
  const [radio_select, setRadioSelect] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    SetOptions_list(poll.options);
  }, []);

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(options_list);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    SetOptions_list(items);
  };

  const handleRadioChange = (e) => {
    setError("");
    setRadioSelect(e.target.value);
  };

  const handleValidation = () => {
    if (poll.poll_type == "msp") {
      const index_option_list = new Array(options_list.length).fill(0);

      options_list.map((option, i) => {
        poll?.options?.map((t, index) => {
          if (t == option) {
            index_option_list[i] = index;
          }
        });
      });

      // console.log("Drag and Drop Index Array: ", index_option_list);
      // handleSubmit(card_index, options_list);
      handleSubmit(card_index, index_option_list);
    } else {
      if (radio_select != "") {
        setRadioSelect("");
        handleSubmit(card_index, radio_select);
      } else {
        setError("Required*");
      }
    }
  };

  return (
    <div className="currentPoll__card">
      <div className="currentPoll__card__question">{poll.question}</div>

      {poll.poll_type == "ssp" ? (
        <RadioGroup
          className="poll_options"
          value={radio_select}
          onChange={handleRadioChange}
        >
          <p className="currentPoll__card__question_info">
            Select one of the below options{" "}
            <span style={{ color: "red" }}>{error != "" ? error : null}</span>
          </p>
          {poll.options.map((option, index) => (
            <div className="currentPoll__card__option">
              <FormControlLabel
                value={index}
                control={<Radio />}
                label={option}
              />
            </div>
          ))}
        </RadioGroup>
      ) : (
        <div className="poll_options_msp">
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <p>Select one of the below options</p>

            <div className="poll_options_msp_dropable">
              <Droppable droppableId={"poll_card_" + card_index}>
                {(provided) => (
                  <ul
                    className="poll_card_msp"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {options_list.map((option, index) => {
                      return (
                        <Draggable
                          key={option}
                          draggableId={option}
                          index={index}
                        >
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <p>{option}</p>
                            </li>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </div>
          </DragDropContext>
        </div>
      )}

      <div className="current_poll_card_submit">
        <div className="btn__container">
          <Button type="submit" onClick={handleValidation}>
            Submit Poll
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CurrentPoll_Card;
