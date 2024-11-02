import { useState, useEffect, SetStateAction } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { Link } from 'react-router-dom';

const Calendar = () => {
  const [dates, setDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    generateDates(currentMonth, currentYear);
  }, [currentMonth, currentYear]);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const generateDates = (month: number, year: number) => {
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = endOfMonth.getDate();
    const startDay = startOfMonth.getDay();

    const datesArray: Array<null|number> = [];
    for (let i = 0; i < startDay; i++) {
      datesArray.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      datesArray.push(day);
    }

    setDates(datesArray);
  };

  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) {
      setCurrentYear((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (currentMonth === 11) {
      setCurrentYear((prev) => prev + 1);
    }
  };

  const rows = [];
  for (let i = 0; i < dates.length; i += 7) {
    rows.push(dates.slice(i, i + 7));
  }

  return (
    <>
      <Breadcrumb pageName="Calendar" />
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePreviousMonth}
          className="px-2 bg-primary text-white rounded"
        >
          Previous
        </button>
        <h2 className="text-xl font-semibold">
          {new Date(currentYear, currentMonth).toLocaleString('default', {
            month: 'long',
          })}{' '}
          {currentYear}
        </h2>
        <button
          onClick={handleNextMonth}
          className="px-2 bg-primary text-white rounded"
        >
          Next
        </button>
      </div>
      <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <table className="w-full">
          <thead>
            <tr className="grid grid-cols-7 rounded-t-sm bg-primary text-white">
              {daysOfWeek.map((day) => (
                <th
                  key={day}
                  className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="grid grid-cols-7">
                {row.map((date, index) => (
                  <td
                    key={index}
                    className="border border-stroke dark:border-strokedark h-20 md:h-25 xl:h-31"
                  >
                    {date ? (
                      <Link
                        to={`/booking/${date}-${
                          currentMonth + 1
                        }-${currentYear}`}
                        className="flex items-center justify-center h-full w-full transition duration-500 hover:bg-gray dark:hover:bg-meta-4"
                      >
                        <span className="font-medium text-black dark:text-white">
                          {date}
                          <h2 className="text-xl font-semibold text-green-400">
                            {date === 2 ? 11 : null}
                          </h2>
                        </span>
                      </Link>
                    ) : (
                      <div className="h-full w-full" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Calendar;
