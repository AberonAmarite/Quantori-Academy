import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateInput = () => {
  const [startDate, setStartDate] = useState(new Date());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // handle text input change here
    console.log(e);
  };

  return (
    <DatePicker
      selected={startDate}
      onChange={(date: Date) => setStartDate(date)}
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
          onChange={handleInputChange}
        />
      }
    />
  );
};

export default DateInput;
