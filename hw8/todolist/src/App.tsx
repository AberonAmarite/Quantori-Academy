import React, { useState } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import Modal from "./components/Modal/Modal";
import CurrentTasks from "./components/CurrentTasks/CurrentTasks";

function App() {
  const [modalVisibility, setModalVisibility] = useState(false);

  const toggleModalVisibility = () => {
    setModalVisibility(!modalVisibility);
  };

  return (
    <div className="App">
      <Header onAddTask={toggleModalVisibility}></Header>
      <Modal
        modalVisibility={modalVisibility}
        toggleModalVisibility={toggleModalVisibility}
      ></Modal>
      <CurrentTasks></CurrentTasks>
    </div>
  );
}

export default App;
