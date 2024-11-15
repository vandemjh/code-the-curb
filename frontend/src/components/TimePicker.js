import React, { useState } from 'react';

const TimePicker = ({ onTimeChange }) => {
  const [hours, setHours] = useState('12');
  const [minutes, setMinutes] = useState('00');
  const [period, setPeriod] = useState('AM');

  const handleHoursChange = (e) => {
    const value = e.target.value;
    if (value === '' || (value >= 1 && value <= 12)) {
      setHours(value);
      if (value !== '') {
        onTimeChange &&
          onTimeChange(`${value.padStart(2, '0')}:${minutes} ${period}`);
      }
    }
  };

  const handleMinutesChange = (e) => {
    const value = e.target.value;
    if (value === '' || (value >= 0 && value <= 59)) {
      setMinutes(value);
      if (value !== '') {
        onTimeChange &&
          onTimeChange(`${hours}:${value.padStart(2, '0')} ${period}`);
      }
    }
  };

  const handlePeriodChange = () => {
    const newPeriod = period === 'AM' ? 'PM' : 'AM';
    setPeriod(newPeriod);
    onTimeChange && onTimeChange(`${hours}:${minutes} ${newPeriod}`);
  };

  const handleBlurHours = () => {
    if (hours === '' || hours < 1 || hours > 12) {
      setHours('12'); // Reset to default if invalid
    } else {
      setHours(hours.padStart(2, '0'));
    }
  };

  const handleBlurMinutes = () => {
    if (minutes === '' || minutes < 0 || minutes > 59) {
      setMinutes('00'); // Reset to default if invalid
    } else {
      setMinutes(minutes.padStart(2, '0'));
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <input
        type="number"
        value={hours}
        onChange={handleHoursChange}
        onBlur={handleBlurHours}
        min="1"
        max="12"
        style={{
          background: 'linear-gradient(45deg, #60a5fa, #3b82f6)',
          borderRadius: 12,

          height: '20px',
          width: '50px',
          textAlign: 'center',
          fontSize: '16px',
          border: 'none',
        }}
      />
      <span>:</span>
      <input
        type="number"
        value={minutes}
        onChange={handleMinutesChange}
        onBlur={handleBlurMinutes}
        min="0"
        max="59"
        style={{
          background: 'linear-gradient(45deg, #60a5fa, #3b82f6)',
          borderRadius: 12,

          width: '50px',
          height: '20px',
          textAlign: 'center',
          fontSize: '16px',
          border: 'none',
        }}
      />
      <button
        onClick={handlePeriodChange}
        style={{
          background: 'linear-gradient(45deg, #60a5fa, #3b82f6)',
          borderRadius: 12,

          width: '50px',
          height: '20px',
          textAlign: 'center',
          fontSize: '16px',
          border: 'none',
        }}
      >
        {period}
      </button>
      <style>
        {`
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
        `}
      </style>
    </div>
  );
};

export default TimePicker;
