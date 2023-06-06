import React, { useState } from "react";
import TextInput from "../TextInput/TextInput";
import Button from "../Button/Button";
import DateInput from "../DateInput/DateInput";
import { addTaskToServer, editTaskToServer } from "../Tasks/Tasks";

import "./Modal.css";
import { Task } from "../../interfaces/Task";
import {
  TasksState,
  addTask,
  editTask,
  toggleModalVisibility,
} from "../../store/taskSlice";
import TagButtons from "../TagButtons/TagButtons";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

interface Props {
  modalName: string;
}

const Modal = ({ modalName }: Props) => {
  const [newTaskName, setNewTaskName] = useState("");
  const [newDeadline, setNewDeadline] = useState(new Date());
  const [newTag, setNewTag] = useState("tag");

  const dispatch = useAppDispatch();

  const modalVisibility = useAppSelector(
    (state: { tasks: TasksState }) => state.tasks.modalVisibility
  );

  const currentTaskId = useAppSelector(
    (state: { tasks: TasksState }) => state.tasks.currentTaskId
  );

  const onAddTask = async (newTask: Task) => {
    await addTaskToServer(newTask);
    dispatch(addTask(newTask));
  };

  const onEditTask = async (newTask: Task) => {
    await editTaskToServer(newTask, currentTaskId);
    dispatch(editTask(newTask));
  };

  const tagButtons = <TagButtons newTag={newTag} setNewTag={setNewTag} />;

  const handleTaskNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTaskName(event.target.value);
  };

  const handleDeadlineChange = (date: Date) => {
    setNewDeadline(date);
  };

  return (
    <div
      className="modal"
      style={{ visibility: modalVisibility ? "visible" : "hidden" }}
    >
      <div className="modal-content">
        <h2>{modalName}</h2>
        <TextInput
          placeholder="Task Title"
          className="modal__task-title"
          onChange={handleTaskNameChange}
        />
        <div className="row modal__row1">
          <div className="modal__tags">{tagButtons}</div>
          <DateInput onChange={handleDeadlineChange}></DateInput>
        </div>
        <div className="row modal__row2">
          <Button
            className="modal__cancel"
            onClick={() => dispatch(toggleModalVisibility())}
          >
            Cancel
          </Button>
          <Button
            className="modal__add-task"
            onClick={() => {
              dispatch(toggleModalVisibility());
              const task: Task = {
                id: modalName === "Add Task" ? Date.now() : currentTaskId,
                title: newTaskName,
                tag: newTag,
                deadline: newDeadline.toString(),
                isCompleted: false,
              };
              if (modalName === "Add Task") {
                onAddTask(task);
              } else {
                if (currentTaskId !== -1) onEditTask(task);
              }
            }}
          >
            {modalName}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
