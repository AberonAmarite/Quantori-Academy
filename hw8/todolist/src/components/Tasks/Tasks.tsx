import React, { useEffect } from "react";
import TaskComponent from "../Task/TaskComponent";
import { Task } from "../../interfaces/Task";

import { useSelector, useDispatch } from "react-redux";
import { fetchTasks, deleteTask, completeTask } from "../../taskSlice";
import { RootState } from "../../store";

interface Props {
  isCompleted: boolean;
}

const Tasks = ({ isCompleted }: Props) => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const dispatch = useDispatch();

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
  return (
    <div>
      <h2>{isCompleted ? "Completed" : "Current"} Tasks</h2>
      {tasks
        .filter((el) => el.isCompleted === isCompleted)
        .map((task) => (
          <TaskComponent
            key={task.id}
            task={task}
            onDelete={handleDeleteTask}
            onComplete={handleComplete}
          ></TaskComponent>
        ))}
    </div>
  );
};

export default Tasks;
