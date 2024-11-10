import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const timeSlots = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
];

const initialSlotsState: { [key: string]: boolean[] } = {};

const Slots: React.FC = () => {
  const [value, setValue] = useState(new Date());
  const [slotsAvailability, setSlotsAvailability] = useState(initialSlotsState);
  const [selectedDay, setSelectedDay] = useState('');

  const getDayName = (date: Date): string => {
    const options = { weekday: 'long' };
    return date.toLocaleDateString('en-US', options);
  };

  const handleDateChange = (date: Date) => {
    setValue(date);
    const dayName = getDayName(date);
    setSelectedDay(dayName);
    if (!slotsAvailability[dayName]) {
      const newSlots = Array(timeSlots.length).fill(true);
      setSlotsAvailability((prevState) => ({
        ...prevState,
        [dayName]: newSlots,
      }));
    }
  };

  const toggleSlot = (index: number) => {
    if (!selectedDay) return;

    setSlotsAvailability((prevState) => {
      const updatedSlots = [...prevState[selectedDay]];
      updatedSlots[index] = !updatedSlots[index];
      return { ...prevState, [selectedDay]: updatedSlots };
    });
  };
  const tileClassName = ({ date }: { date: Date }) => {
    const today = new Date();
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return 'today';
    }
    return '';
  };

  return (
    <div className="slots-container">
      <h2>Select a Date:</h2>
      <Calendar
        onChange={handleDateChange}
        value={value}
        tileClassName={tileClassName}
      />

      {selectedDay && (
        <div className="day-slots">
          <h3 className="text-lg font-semibold">{selectedDay}</h3>
          <div className="grid grid-cols-3 gap-4">
            {slotsAvailability[selectedDay].map((isAvailable, index) => (
              <div
                key={index}
                className={`slot ${isAvailable ? 'available' : 'blocked'}`}
                onClick={() => toggleSlot(index)}
                style={{
                  cursor: 'pointer',
                  backgroundColor: isAvailable ? '#4caf50' : '#f44336',
                  color: 'white',
                  padding: '10px',
                  textAlign: 'center',
                  borderRadius: '5px',
                }}
              >
                {timeSlots[index]}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Slots;
