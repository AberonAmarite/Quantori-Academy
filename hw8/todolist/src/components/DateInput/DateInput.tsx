import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
  onChange?: (date: Date) => void;
}

const DateInput = ({ onChange }: Props) => {
  const [startDate, setStartDate] = useState(new Date());

  return (
    <DatePicker
      selected={startDate}
      onChange={(date: Date) => {
        setStartDate(date);
        if (onChange) onChange(date);
      }}
      dateFormat="dd.MM.yyyy"
      showPopperArrow={false}
      customInput={
        <input
          className="modal__deadline"
          type="text"
          value={startDate.toLocaleDateString()}
          onClick={(e: React.MouseEvent<HTMLInputElement>) => {
            (e.target as HTMLInputElement).nextSibling?.dispatchEvent(
              new MouseEvent("click", { bubbles: true })
            );
          }}
        />
      }
    />
  );
};

export default DateInput;
