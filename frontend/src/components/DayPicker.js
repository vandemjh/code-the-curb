import React, { useState, useEffect } from 'react';

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const DayPicker = ({ onDayChange }) => {
  const [day, setDay] = useState(0);

  useEffect(() => onDayChange(0));

  const handleDayChange = () => {
    if (day >= 6) setDay(0);
    else setDay(day + 1);
    onDayChange && onDayChange(day);
  };

  return (
    <button
      onClick={handleDayChange}
      style={{
        background: 'linear-gradient(45deg, #60a5fa, #3b82f6)',
        borderRadius: 12,

        height: '20px',
        textAlign: 'center',
        fontSize: '16px',
        border: 'none',
      }}
    >
      {daysOfWeek[day]}s
    </button>
  );
};

export default DayPicker;
