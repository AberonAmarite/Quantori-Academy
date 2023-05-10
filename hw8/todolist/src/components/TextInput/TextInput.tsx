import React from "react";
import "./TextInput.css";

interface Props {
  placeholder: string;
  className?: string;
}

const TextInput = ({ placeholder, className }: Props) => {
  return (
    <input
      type="search"
      placeholder={placeholder}
      className={`search-input ${className}`}
    ></input>
  );
};

export default TextInput;
