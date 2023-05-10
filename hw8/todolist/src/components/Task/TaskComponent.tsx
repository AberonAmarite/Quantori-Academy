import React from "react";
import "./TaskComponent.css";
import { Task } from "../../interfaces/Task";

interface Props {
  task: Task;
  onDelete: (currentTask: Task) => void;
  onComplete?: (currentTask: Task) => void;
}

const displayDate = (date: Date) => {
  const correctDate = new Date(date);
  const today = new Date();
  const tomorrow = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1
  );
  if (correctDate.toDateString() === today.toDateString()) {
    return "Today";
  }
  if (correctDate.toDateString() === tomorrow.toDateString()) {
    return "Tomorrow";
  }
  return correctDate.toDateString();
};

const TaskComponent = ({ task, onDelete, onComplete }: Props) => {
  const { title, tag, deadline } = task;
  return (
    <div className="row current">
      <button
        className="current__checkbox"
        onClick={() => {
          if (onComplete) onComplete(task);
        }}
      ></button>
      <div className="column current__main-text">
        <h3 className="current__title">{title}</h3>
        <div className="row">
          <div className="">
            <div className={`tag tag-${tag}`}>{tag}</div>
          </div>
          <div className="current__deadline">{displayDate(deadline)}</div>
        </div>
      </div>
      <button
        className="current__delete"
        onClick={() => {
          onDelete(task);
        }}
      ></button>
    </div>
  );
};

export default TaskComponent;
