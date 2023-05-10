import React, { useEffect } from "react";
import TaskComponent from "../Task/TaskComponent";
import { Task } from "../../interfaces/Task";

interface Props {
  isCompleted: boolean;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onComplete?: (currentTask: Task) => void;
}

const Tasks = ({ isCompleted, tasks, setTasks, onComplete }: Props) => {
  const handleDeleteTask = async (deletedTask: Task) => {
    await fetch(`http://localhost:3004/tasks/${deletedTask.id}`, {
      method: "DELETE",
    });
    setTasks((prevTasks) =>
      prevTasks.filter((task: Task) => task.id !== deletedTask.id)
    );
  };

  useEffect(() => {
    async function fetchTasksFromServer() {
      const response = await fetch("http://localhost:3004/tasks");
      const tasks = await response.json();
      setTasks(tasks);
    }
    fetchTasksFromServer();
  }, []);

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
            onComplete={onComplete}
          ></TaskComponent>
        ))}
    </div>
  );
};

export default Tasks;
