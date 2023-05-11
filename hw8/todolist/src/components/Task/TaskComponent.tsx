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
  const type = task.isCompleted ? "completed" : "current";
  return (
    <div className={`row ${type}`}>
      <button
        className={`${type}__checkbox`}
        onClick={() => {
          if (onComplete) onComplete(task);
        }}
      ></button>
      <div className={`column ${type}__main-text`}>
        <h3 className={`${type}__title`}>{title}</h3>
        <div className="row">
          <div className="">
            <div className={`tag tag-${tag}`}>{tag}</div>
          </div>
          <div className={`${type}__deadline`}>
            {displayDate(new Date(deadline))}
          </div>
        </div>
      </div>
      {task.isCompleted ? (
        ""
      ) : (
        <button
          className="current__delete"
          onClick={() => {
            onDelete(task);
          }}
        ></button>
      )}
    </div>
  );
};

export default TaskComponent;
