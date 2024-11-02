import { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

type Booking = {
  id: number;
  time: string;
  customerName: string;
  mobileNo: string;
  sport: string;
  members: string;
  status: string;
};

export default function BookingDetails() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const date = window.location.pathname.split('/')[2];
  useEffect(() => {
    const fetchBookings = async () => {
      const mockData: Booking[] = [
        {
          id: 1,
          time: '9am - 12pm',
          customerName: 'Danya R',
          mobileNo: '123-456-7890',
          sport: 'Badminton',
          members: '4',
          status: 'new',
        },
        {
          id: 2,
          time: '1pm - 4pm',
          customerName: 'Aryan S',
          mobileNo: '987-654-3210',
          sport: 'Football',
          members: '8',
          status: 'booked',
        },
        {
          id: 3,
          time: '4pm - 7pm',
          customerName: 'Maya K',
          mobileNo: '456-789-1234',
          sport: 'Basketball',
          members: '5',
          status: 'rejected',
        },
      ];
      setBookings(mockData);
    };

    fetchBookings();
  }, []);

  return (
    <>
      <Breadcrumb db pageName={`${date}`} />
      <div className="space-y-8">
        <h2 className="text-xl font-semibold text-gray-950 dark:text-white">
          New Bookings
        </h2>
        {bookings
          .filter((booking) => booking.status === 'new')
          .map((booking) => (
            <BookingCard key={booking.id} {...booking} />
          ))}

        <h2 className="text-xl font-semibold text-green-500">Booked</h2>
        {bookings
          .filter((booking) => booking.status === 'booked')
          .map((booking) => (
            <BookingCard key={booking.id} {...booking} />
          ))}

        <h2 className="text-xl font-semibold text-red-600">Rejected</h2>
        {bookings
          .filter((booking) => booking.status === 'rejected')
          .map((booking) => (
            <BookingCard key={booking.id} {...booking} />
          ))}
      </div>
    </>
  );
}

function BookingCard({
  time,
  customerName,
  mobileNo,
  sport,
  members,
  status,
}: Booking) {
  return (
    <div className="flex items-start justify-between rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-4">
      <div className="flex-shrink-0 text-lg font-semibold text-gray-900 dark:text-white">
        {time}
      </div>
      <div className="ml-4 flex-1 space-y-2">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Customer: <span className="font-medium">{customerName}</span>
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Mobile No: <span className="font-medium">{mobileNo}</span>
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Sport: <span className="font-medium">{sport}</span>
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No. of Members: <span className="font-medium">{members}</span>
        </p>
        {status === 'new' && (
          <div className="flex items-center gap-4 mt-4">
            <button
              type="button"
              className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"
            >
              Accept
            </button>
            <button
              type="button"
              className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
            >
              <svg
                className="me-1.5 h-5 w-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L17.94 6M18 18L6.06 6"
                />
              </svg>
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
