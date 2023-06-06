import React from "react";
import "./App.css";
import Header from "./components/Header/Header";
import Modal from "./components/Modal/Modal";
import Tasks from "./components/Tasks/Tasks";
import { useAppSelector } from "./store/hooks";
import { TasksState } from "./store/taskSlice";

export const tags = ["health", "work", "home", "other"];
export const uniqueTagColors = ["#0053CF", "#9747FF", "#639462", "#EA8C00"];

function App() {
  const modalType = useAppSelector(
    (state: { tasks: TasksState }) => state.tasks.modalType
  );

  return (
    <div className="App">
      <Header></Header>
      <Tasks isCompleted={false}></Tasks>
      <Tasks isCompleted={true}></Tasks>
      <Modal modalName={modalType}></Modal>
    </div>
  );
}

export default App;
