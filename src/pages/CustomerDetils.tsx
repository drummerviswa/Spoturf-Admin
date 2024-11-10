import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import makeRequest from '../axios';
import moment from 'moment';

interface Booking {
  date: string;
  slot: [];
  game: [];
  court: string;
  paymentAmount: string;
  paymentMethod: string;
  turfId: number;
  turfName: string;
}

interface Turf {
  TID: number;
  turfName: string;
  address: string;
}

interface Customer {
  CID: number;
  name: string;
  mobileNo: string;
  area: string;
  bookings: Booking[];
}

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [selectedTurfId, setSelectedTurfId] = useState<number | null>(null);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const response = await makeRequest.get(`/customers/customer/${id}`);
        setCustomer(response.data);
      } catch (error) {
        console.error('Error fetching customer details:', error);
      }
    };

    const fetchTurfs = async () => {
      try {
        const response = await makeRequest.get('/turfs');
        setTurfs(response.data);
      } catch (error) {
        console.error('Error fetching turfs:', error);
      }
    };

    fetchCustomerDetails();
    fetchTurfs();
  }, [id]);

  const handleTurfChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const turfId = parseInt(e.target.value);
    setSelectedTurfId(turfId);

    if (customer) {
      try {
        const response = await makeRequest.get(
          `/bookings/turf/${customer.CID}/${turfId}`,
        );
        setFilteredBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    }
  };
  console.log(filteredBookings);

  return (
    <div className="mx-auto p-6 bg-white border-b dark:bg-gray-800 dark:border-gray-700 rounded-lg shadow-md">
      {customer ? (
        <>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {customer.name}'s Details
          </h1>
          <p className="text-lg text-gray-900 dark:text-white">
            <strong>Mobile Number:</strong> {customer.mobileNo}
          </p>
          <p className="text-lg text-gray-900 dark:text-white">
            <strong>Area:</strong> {customer.area}
          </p>

          <h2 className="text-2xl font-semibold mt-4 text-gray-900 dark:text-white">
            Bookings
          </h2>

          <div className="mb-4">
            <label
              htmlFor="turf-select"
              className="block text-sm font-medium text-gray-900 dark:text-white"
            >
              Select Turf:
            </label>
            <select
              id="turf-select"
              onChange={handleTurfChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="">-- Select a Turf --</option>
              {turfs.map((turf) => (
                <option key={turf.TID} value={turf.TID}>
                  {`${turf.TID} - ${turf.turfName} - ${turf.address}`}
                </option>
              ))}
            </select>
          </div>

          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs bg-primary text-gray-700 uppercase">
              <tr>
                <th className="px-4 py-2 text-gray-900 dark:text-white">
                  Date
                </th>
                <th className="px-4 py-2 text-gray-900 dark:text-white">
                  Slot
                </th>
                <th className="px-4 py-2 text-gray-900 dark:text-white">
                  Game
                </th>
                <th className="px-4 py-2 text-gray-900 dark:text-white">
                  Court
                </th>
                <th className="px-4 py-2 text-gray-900 dark:text-white">
                  Payment Amount
                </th>
                <th className="px-4 py-2 text-gray-900 dark:text-white">
                  Payment Method
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <td className="px-4 py-2 text-gray-900 dark:text-white">
                      {moment(booking.date).format('MMM Do YY')}
                    </td>
                    <td className="px-4 py-2 text-gray-900 dark:text-white">
                    {booking?.slot?.map((i) => (
                        <li className="list-none">{i}</li>
                      ))}
                    </td>
                    <td className="px-4 py-2 text-gray-900 dark:text-white">
                      {booking.game.map((i) => (
                        <span className="px-0.5">{i}</span>
                      ))}
                    </td>
                    <td className="px-4 py-2 text-gray-900 dark:text-white">
                      {booking.court}
                    </td>
                    <td className="px-4 py-2 text-gray-900 dark:text-white">
                      {booking.paymentAmount}
                    </td>
                    <td className="px-4 py-2 text-gray-900 dark:text-white">
                      {booking.paymentMethod}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-2 text-gray-600 dark:text-gray-300"
                  >
                    No bookings found for the selected turf.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      ) : (
        <p>Loading customer details...</p>
      )}
    </div>
  );
};

export default CustomerDetail;
