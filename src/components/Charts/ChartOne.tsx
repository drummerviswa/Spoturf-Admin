import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import makeRequest from '../../axios';
import { AuthContext, useAuth } from '../../context/AuthContext';

const options: ApexOptions = {
  chart: {
    type: 'line',
    height: 350,
    zoom: {
      enabled: false,
    },
  },
  colors: ['#588157'],
  stroke: {
    width: 2,
    curve: 'smooth',
  },
  grid: {
    borderColor: '#f1f1f1',
    row: {
      colors: ['transparent', 'transparent'],
      opacity: 0.5,
    },
  },
  xaxis: {
    categories: [],
    title: {
      text: 'Date',
    },
  },
  yaxis: {
    title: {
      text: 'Bookings',
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: '#fff',
    strokeColors: '#588157',
    strokeWidth: 3,
  },
};

interface ChartOneState {
  series: {
    name: string;
    data: number[];
  }[];
}

const ChartOne: React.FC = () => {
  const { currentUser } = useAuth(AuthContext);
  const [state, setState] = useState<ChartOneState>({
    series: [
      {
        name: 'Bookings',
        data: [],
      },
    ],
  });
  const [view, setView] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const { data } = await makeRequest.get(
          `/bookings/all`,
        );
        console.log(data);

        // Get current date
        const now = new Date();

        let categories: string[] = [];
        let seriesData: number[] = [];

        if (view === 'week') {
          const now = new Date();
          const dayOfWeek = now.getDay();
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - dayOfWeek);
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          categories = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          seriesData = new Array(7).fill(0);

          console.log('Start of Week:', startOfWeek);
          console.log('End of Week:', endOfWeek);

          data.forEach((booking: { date: string }) => {
            const bookingDate = new Date(booking.date);
            console.log('Booking Date:', bookingDate);

            if (bookingDate >= startOfWeek && bookingDate <= endOfWeek) {
              const dayOfWeek = bookingDate.getDay();
              console.log('DOW', dayOfWeek);
              seriesData[dayOfWeek] += 1;
            }
          });
        } else if (view === 'month') {
          // Calculate the current month and filter bookings by date
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

          categories = [];
          seriesData = new Array(endOfMonth.getDate()).fill(0); // Initialize array for all days in the month

          // Filter bookings for the month and count bookings for each day
          data.forEach((booking: { date: string }) => {
            const bookingDate = new Date(booking.date);
            if (bookingDate >= startOfMonth && bookingDate <= endOfMonth) {
              const dayOfMonth = bookingDate.getDate() - 1; // Get the day of the month (0-based)
              seriesData[dayOfMonth] += 1;
            }
          });

          // Fill categories with day numbers
          categories = Array.from({ length: endOfMonth.getDate() }, (_, i) =>
            (i + 1).toString(),
          );
        } else if (view === 'year') {
          // Calculate the current year and filter bookings by month
          const startOfYear = new Date(now.getFullYear(), 0, 1);
          const endOfYear = new Date(now.getFullYear(), 11, 31);

          categories = [];
          seriesData = new Array(12).fill(0); // Initialize array for 12 months

          // Filter bookings for the year and count bookings for each month
          data.forEach((booking: { date: string }) => {
            const bookingDate = new Date(booking.date);
            if (bookingDate >= startOfYear && bookingDate <= endOfYear) {
              const monthOfYear = bookingDate.getMonth(); // Get the month (0-11)
              seriesData[monthOfYear] += 1;
            }
          });

          // Fill categories with month names
          categories = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ];
        }

        // Set the state with the appropriate data
        setState({
          series: [
            {
              name: 'Bookings',
              data: seriesData,
            },
          ],
        });

        options.xaxis.categories = categories;
      } catch (error) {
        console.error('Error fetching booking data:', error);
      }
    };

    fetchBookingData();
  }, [view, currentUser.TID]);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-12">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full max-w-45 justify-end">
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
            <button
              className={`rounded py-1 px-3 text-xs font-medium text-black ${
                view === 'week' ? 'bg-white shadow-card' : ''
              } hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark`}
              onClick={() => setView('week')}
            >
              This Week
            </button>
            <button
              className={`rounded py-1 px-3 text-xs font-medium text-black ${
                view === 'month' ? 'bg-white shadow-card' : ''
              } hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark`}
              onClick={() => setView('month')}
            >
              This Month
            </button>
            <button
              className={`rounded py-1 px-3 text-xs font-medium text-black ${
                view === 'year' ? 'bg-white shadow-card' : ''
              } hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark`}
              onClick={() => setView('year')}
            >
              This Year
            </button>
          </div>
        </div>
      </div>
      <div>
        <ReactApexChart
          options={options}
          series={state.series}
          type="line"
          height={350}
        />
      </div>
    </div>
  );
};

export default ChartOne;
