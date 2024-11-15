import { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { AuthContext } from '../../context/AuthContext';
import makeRequest from '../../axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

const TurfBookings = () => {
  const { currentUser } = useContext(AuthContext);
  const [turfs, setTurfs] = useState([]);
  const [selectedTurf, setSelectedTurf] = useState<string>('');
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [, setLoading] = useState<boolean>(true);

  // Fetch the list of turfs for the dropdown
  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        const response = await makeRequest.get('/turfs');
        setTurfs(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTurfs();
  }, []);

  // Fetch bookings for the selected turf
  useEffect(() => {
    if (!selectedTurf) return;

    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await makeRequest.get(
          `/bookings/admin/${selectedTurf}`,
        );
        setBookings(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [selectedTurf]);

  console.log(bookings);

  const filteredBookings = bookings.filter((booking) => {
    const name = booking?.name?.toLowerCase() || '';

    return name.includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <Breadcrumb pageName="Bookings" />

      <form
        className="my-8"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <label
          htmlFor="turfSelect"
          className="text-sm font-medium text-gray-900"
        >
          Select Turf:
        </label>
        <select
          id="turfSelect"
          value={selectedTurf}
          onChange={(e) => setSelectedTurf(e.target.value)}
          className="block w-full p-2 mt-2 text-sm border-gray-300 rounded-lg"
        >
          <option value="">Choose a turf</option>
          {turfs.map((turf) => (
            <option key={turf.TID} value={turf.TID}>
              {turf.TID} - {turf.turfName}
            </option>
          ))}
        </select>
      </form>

      <form className="my-8">
        <label
          htmlFor="search"
          className="mb-2 text-sm font-medium text-gray-900"
        >
          Search Bookings
        </label>
        <input
          type="search"
          id="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full p-4 mt-2 text-sm border-gray-300 rounded-lg"
          placeholder="Search Customer"
        />
      </form>

      <div className="flex flex-col gap-10">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs font-semibold uppercase bg-primary text-white">
              <tr>
                <th scope="col" className="px-6 py-3">
                  BID
                </th>
                <th scope="col" className="px-6 py-3">
                  Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Customer Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Slot
                </th>
                <th scope="col" className="px-6 py-3">
                  Game
                </th>
                <th scope="col" className="px-6 py-3">
                  Team Members
                </th>
                <th scope="col" className="px-6 py-3">
                  Court
                </th>
                <th scope="col" className="px-6 py-3">
                  Payment Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking, index) => (
                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{booking.BID}</td>
                  <td className="px-6 py-4">
                    {moment(booking.date).format('ll')}
                  </td>
                  <td className="px-6 py-4">{booking.name}</td>
                  <td className="px-6 py-4">
                    {(booking.slot ?? []).join(', ')}
                  </td>
                  <td className="px-6 py-4">
                    {(booking.game ?? []).join(', ')}
                  </td>
                  <td className="px-6 py-4">{booking.teamMembers}</td>
                  <td className="px-6 py-4">{booking.court}</td>
                  <td className="px-6 py-4">{booking.paymentStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TurfBookings;
