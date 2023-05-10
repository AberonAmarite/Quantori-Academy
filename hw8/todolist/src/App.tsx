import React, { useState } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import Modal from "./components/Modal/Modal";
import Tasks from "./components/Tasks/Tasks";

function App() {
  const [modalVisibility, setModalVisibility] = useState(false);

  const toggleModalVisibility = () => {
    setModalVisibility(!modalVisibility);
  };

  return (
    <div className="App">
      <Header onAddTask={toggleModalVisibility}></Header>
      <Tasks isCompleted={false}></Tasks>
      <Tasks isCompleted={true}></Tasks>
      <Modal
        modalVisibility={modalVisibility}
        toggleModalVisibility={toggleModalVisibility}
      ></Modal>
    </div>
  );
}

export default App;
