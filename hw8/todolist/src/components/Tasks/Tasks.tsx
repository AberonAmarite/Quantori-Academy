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

const fetchTasks = () => {
  return (dispatch: AppDispatch) => {
    fetch("http://localhost:3004/tasks")
      .then((response) => response.json())
      .then((tasks) => {
        dispatch(setTasks(tasks));
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
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const taskType = isCompleted ? "Completed" : "Current";

  if (tasks) {
    return (
      <div>
        <h2>{taskType} Tasks</h2>
        {tasks
          .filter((el: Task) => el.isCompleted === isCompleted)
          .map((task: Task) => (
            <TaskComponent
              key={task.id}
              task={task}
              onDelete={handleDeleteTask}
              onComplete={handleComplete}
            ></TaskComponent>
          ))}
      </div>
    );
  } else {
    return <h3> No {taskType} tasks</h3>;
  }
};

export default Tasks;
