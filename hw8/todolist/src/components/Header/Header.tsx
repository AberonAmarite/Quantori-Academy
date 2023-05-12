import React, { useState } from "react";
import TextInput from "../TextInput/TextInput";
import Button from "../Button/Button";
import WeatherWidget from "../WeatherWidget/WeatherWidget";

import "./Header.css";
import TagButtons from "../TagButtons/TagButtons";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { setModalType, toggleModalVisibility } from "../../store/taskSlice";

const Header = () => {
  const [newTag, setNewTag] = useState("tag");
  const navigate = useNavigate();

  const handleInputQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const uri = `/tasks/${
      newTag === "tag" ? "" : newTag
    }?q=${encodeURIComponent(event.target.value.toLowerCase())}`;
    navigate(uri);
  };

  const dispatch = useAppDispatch();

  const onAddTask = () => {
    dispatch(setModalType("Add Task"));
    dispatch(toggleModalVisibility());
  };

  return (
    <header className="header">
      <div className="row header__top">
        <h1 className="header__title">To Do List</h1>
        <WeatherWidget></WeatherWidget>
      </div>
      <div className="header__main">
        <TextInput
          placeholder="Search Task"
          onChange={handleInputQueryChange}
        ></TextInput>
        <div className="header__filters">
          <TagButtons newTag={newTag} setNewTag={setNewTag} isLink={true} />
        </div>
        <Button className="header__new-task" onClick={onAddTask}>
          + New Task
        </Button>
      </div>
    </header>
  );
};

export default Header;
