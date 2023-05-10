import React, { useState } from "react";
import TextInput from "../TextInput/TextInput";
import Button from "../Button/Button";
import DateInput from "../DateInput/DateInput";

import "./Modal.css";

interface Props {
  modalVisibility: boolean;
  toggleModalVisibility: () => void;
}

const Modal = ({ modalVisibility, toggleModalVisibility }: Props) => {
  const [tagColors, setTagColors] = useState(["#FFF", "#FFF", "#FFF", "#FFF"]);
  const tags = ["health", "work", "home", "other"];
  const uniqueTagColors = ["#0053CF", "#9747FF", "#639462", "#EA8C00"];
  const tagButtons = tags.map((tag, index) => {
    let nextTagColors = ["#FFF", "#FFF", "#FFF", "#FFF"];
    nextTagColors[index] = uniqueTagColors[index];
    return (
      <button
        className={`tag tag-${tag}`}
        id={tag}
        style={{
          border: `1px solid ${tagColors[index]}`,
        }}
        onClick={() => setTagColors(nextTagColors)}
        key={index}
      >
        {tag}
      </button>
    );
  });

  return (
    <div
      className="modal"
      style={{ visibility: modalVisibility ? "visible" : "hidden" }}
    >
      <div className="modal-content">
        <h2>Add Task</h2>
        <TextInput placeholder="Task Title" className="modal__task-title" />
        <div className="row modal__row1">
          <div className="modal__tags">{tagButtons}</div>
          <DateInput></DateInput>
        </div>
        <div className="row modal__row2">
          <Button className="modal__cancel" onClick={toggleModalVisibility}>
            Cancel
          </Button>
          <Button className="modal__add-task" onClick={toggleModalVisibility}>
            Add Task
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
