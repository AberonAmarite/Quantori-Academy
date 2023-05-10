import React from "react";
import TextInput from "../TextInput/TextInput";
import Button from "../Button/Button";
import WeatherWidget from "../WeatherWidget/WeatherWidget";

import "./Header.css";

interface Props {
  onAddTask: () => void;
}

const Header = ({ onAddTask }: Props) => {
  return (
    <header className="header">
      <div className="row header__top">
        <h1 className="header__title">To Do List</h1>
        <WeatherWidget></WeatherWidget>
      </div>
      <div className="header__main">
        <TextInput placeholder="Search Task"></TextInput>
        <Button className="header__new-task" onClick={onAddTask}>
          + New Task
        </Button>
      </div>
    </header>
  );
};

export default Header;
