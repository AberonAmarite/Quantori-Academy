import React from "react";
import "./TextInput.css";

interface Props {
  placeholder: string;
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInput = ({ placeholder, className, onChange }: Props) => {
  return (
    <input
      type="search"
      placeholder={placeholder}
      className={`search-input ${className}`}
      onChange={onChange}
    ></input>
  );
};

export default TextInput;
