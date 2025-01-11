import React, { useState } from "react";

const CheckBox = ({ student, handleCheckboxChange }) => {
  const [isChecked, setIsChecked] = useState(false);

  const onChange = (e) => {
    setIsChecked(e.target.checked);
    handleCheckboxChange(student, e.target.checked);  // Call parent handler
  };

  return (
    <input
      type="checkbox"
      checked={isChecked}
      onChange={onChange}
      className="checkbox-style"
    />
  );
};

export default CheckBox;
