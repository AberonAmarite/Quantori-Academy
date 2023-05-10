import React, { useState } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import Modal from "./components/Modal/Modal";
import Tasks from "./components/Tasks/Tasks";
import { Task } from "./interfaces/Task";

function App() {
  const [modalVisibility, setModalVisibility] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([]);

  const handleAddTask = async (newTask: Task) => {
    const response = await fetch("http://localhost:3004/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    });
    const task = await response.json();
    setTasks([...tasks, task]);
  };

  const handleCompleteTask = async (taskToComplete: Task) => {
    const completedTask = {
      ...taskToComplete,
      isCompleted: true,
    };
    setTasks(
      tasks.map((task) => (task === taskToComplete ? completedTask : task))
    );

    await fetch("http://localhost:3004/tasks/" + taskToComplete.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(completedTask),
    });
  };

  const toggleModalVisibility = () => {
    setModalVisibility(!modalVisibility);
  };

  return (
    <div className="App">
      <Header onAddTask={toggleModalVisibility}></Header>
      <Tasks
        isCompleted={false}
        tasks={tasks}
        setTasks={setTasks}
        onComplete={handleCompleteTask}
      ></Tasks>
      <Tasks isCompleted={true} tasks={tasks} setTasks={setTasks}></Tasks>
      <Modal
        modalVisibility={modalVisibility}
        toggleModalVisibility={toggleModalVisibility}
        onAddTask={handleAddTask}
      ></Modal>
    </div>
  );
}

export default App;
