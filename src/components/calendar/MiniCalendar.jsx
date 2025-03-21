import React, { useState } from "react";
import Calendar from "react-calendar";
import Card from "components/card";
import "react-calendar/dist/Calendar.css";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import "assets/css/MiniCalendar.css";

const MiniCalendar = ({ onSelect }) => {
  const [value, setValue] = useState(new Date());

  const handleChange = (date) => {
    setValue(date);
    if (onSelect) {
      const formattedDate = date.toISOString().split("T")[0]; // Format as "YYYY-MM-DD"
      onSelect(formattedDate); // Notify parent component
    }
  };

  return (
    <div>
      <Card extra="flex w-full h-full flex-col px-3 py-3">
        <Calendar
          onChange={handleChange} // Call handleChange when date changes
          value={value}
          prevLabel={<MdChevronLeft className="ml-1 h-6 w-6 " />}
          nextLabel={<MdChevronRight className="ml-1 h-6 w-6 " />}
          view={"month"}
        />
      </Card>
    </div>
  );
};

export default MiniCalendar;
