import React, { useState } from 'react';

const TimePicker = ({ onTimeChange }) => {
  const [hours, setHours] = useState('12');
  const [minutes, setMinutes] = useState('00');
  const [period, setPeriod] = useState('AM');

  const handleHoursChange = (e) => {
    const value = e.target.value;
    if (value >= 1 && value <= 12) {
      setHours(value.padStart(2, '0'));
      onTimeChange &&
        onTimeChange(`${value.padStart(2, '0')}:${minutes} ${period}`);
    }
  };

  const handleMinutesChange = (e) => {
    const value = e.target.value;
    if (value >= 0 && value <= 59) {
      setMinutes(value.padStart(2, '0'));
      onTimeChange &&
        onTimeChange(`${hours}:${value.padStart(2, '0')} ${period}`);
    }
  };

  const handlePeriodChange = () => {
    const newPeriod = period === 'AM' ? 'PM' : 'AM';
    setPeriod(newPeriod);
    onTimeChange && onTimeChange(`${hours}:${minutes} ${newPeriod}`);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <input
        type="number"
        value={hours}
        onChange={handleHoursChange}
        min="1"
        max="12"
        style={{
          background: 'linear-gradient(45deg, #60a5fa, #3b82f6)',
          borderRadius: 12,

          height: '20px',
          width: '50px',
          textAlign: 'center',
          padding: '4px',
          border: 'none',
        }}
      />
      <span>:</span>
      <input
        type="number"
        value={minutes}
        onChange={handleMinutesChange}
        min="0"
        max="59"
        style={{
          background: 'linear-gradient(45deg, #60a5fa, #3b82f6)',
          borderRadius: 12,

          width: '50px',
          height: '20px',
          textAlign: 'center',
          padding: '4px',
          border: 'none',
        }}
      />
      <button
        onClick={handlePeriodChange}
        style={{
          background: 'linear-gradient(45deg, #60a5fa, #3b82f6)',
          borderRadius: 12,
          height: '20px',

          padding: '4px 8px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {period}
      </button>
    </div>
  );
};

export default TimePicker;
