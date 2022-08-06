import React from "react";
import "./MessageReaction.css";

function MessageReaction({ message, handleReaction }) {
  return (
    <>
      <span className="chat__reaction">
        <span
          className="chat__reaction__icon"
          onClick={() => handleReaction(message, "👍")}
        >
          👍
        </span>
        <span
          className="chat__reaction__icon"
          onClick={() => handleReaction(message, "😍")}
        >
          😍
        </span>
        <span
          className="chat__reaction__icon"
          onClick={() => handleReaction(message, "😆")}
        >
          😆
        </span>
        <span
          className="chat__reaction__icon"
          onClick={() => handleReaction(message, "😲")}
        >
          😲
        </span>
        <span
          className="chat__reaction__icon"
          onClick={() => handleReaction(message, "🙁")}
        >
          🙁
        </span>
        <span
          className="chat__reaction__icon"
          onClick={() => handleReaction(message, "😡")}
        >
          😡
        </span>
        <span className="chat__reaction__icon">|</span>
        <span
          className="chat__reaction__icon"
          onClick={() => handleReaction(message, "➕")}
        >
          ➕
        </span>
      </span>

      <span
        className="chat__user_reaction"
        style={{ display: message.reaction != "" ? "block" : "none" }}
      >
        {message.reaction}
      </span>
    </>
  );
}

export default MessageReaction;
