import React, { useEffect } from "react";
import TaskComponent from "../Task/TaskComponent";
import { Task } from "../../interfaces/Task";

import {
  TasksState,
  completeTask,
  deleteTask,
  setTasks,
} from "../../store/taskSlice";
import { AppDispatch } from "../../store";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Routes, Route, useLocation } from "react-router-dom";
import { tags } from "../../App";

interface Props {
  isCompleted: boolean;
}

export const addTaskToServer = async (newTask: Task) => {
  await fetch("http://localhost:3004/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTask),
  });
};

export const editTaskToServer = async (
  editedTask: Task,
  currentTaskId: number
) => {
  await fetch(`http://localhost:3004/tasks/${currentTaskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editedTask),
  });
};

const fetchTasks = (query: string = "") => {
  return (dispatch: AppDispatch) => {
    fetch("http://localhost:3004/tasks")
      .then((response) => response.json())
      .then((tasks: Task[]) => {
        query
          ? dispatch(
              setTasks(
                tasks.filter((task: Task) =>
                  task.title.toLowerCase().startsWith(query.toLowerCase())
                )
              )
            )
          : dispatch(setTasks(tasks));
      });
  };
};

const Tasks = ({ isCompleted }: Props) => {
  const tasks = useAppSelector(
    (state: { tasks: TasksState }) => state.tasks.tasks
  );

  const dispatch = useAppDispatch();

  const handleComplete = (task: Task) => {
    dispatch(completeTask(task));
  };

  const handleDeleteTask = async (deletedTask: Task) => {
    await fetch(`http://localhost:3004/tasks/${deletedTask.id}`, {
      method: "DELETE",
    });
    dispatch(deleteTask(deletedTask));
  };

  const TaskList = () => {
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const q = queryParams.get("q"); // get the 'q' query parameter

    useEffect(() => {
      if (q) {
        dispatch(fetchTasks(q));
      } else {
        dispatch(fetchTasks());
      }
    }, [q]);
  };
  TaskList();

  const taskType = isCompleted ? "Completed" : "Current";

  let tagsAndEmpty = [...tags, ""];

  const mapTagToRoute = (tag: string) => {
    return (
      <Route
        key={tag}
        path={`/tasks/${tag}`}
        element={tasks
          .filter((el: Task) => el.isCompleted === isCompleted)
          .filter((task) => task.tag === tag || tag === "")
          .map((task: Task) => (
            <TaskComponent
              key={task.id}
              task={task}
              onDelete={handleDeleteTask}
              onComplete={handleComplete}
            ></TaskComponent>
          ))}
      />
    );
  };
  return (
    <div>
      <h2>{taskType} Tasks</h2>
      {tasks ? (
        <Routes>
          {tagsAndEmpty.map(mapTagToRoute)}
          <Route
            path="/"
            element={tasks
              .filter((el: Task) => el.isCompleted === isCompleted)
              .map((task: Task) => (
                <TaskComponent
                  key={task.id}
                  task={task}
                  onDelete={handleDeleteTask}
                  onComplete={handleComplete}
                ></TaskComponent>
              ))}
          />
        </Routes>
      ) : (
        <h3> No {taskType} tasks</h3>
      )}
    </div>
  );
};

export default Tasks;
