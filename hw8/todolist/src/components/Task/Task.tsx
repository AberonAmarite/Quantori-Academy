import React from "react";
import "./Task.css";

const Task = () => {
  return (
    <div className="row current">
      <button className="current__checkbox"></button>
      <div className="column current__main-text">
        <h3 className="current__title">fd</h3>
        <div className="row">
          <div className="">
            <div className="tag tag-other">other</div>
          </div>
          <div className="current__deadline">Today</div>
        </div>
      </div>
      <button className="current__delete"></button>
    </div>
  );
};

export default Task;
