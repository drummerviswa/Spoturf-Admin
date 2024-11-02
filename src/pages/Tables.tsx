import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';

const Customers = () => {
  const customers = [
    {
      name: 'Danya R',
      mobile: '+91 9003136720',
      bookings: [
        {
          date: '30-10-2024',
          slot: '9am - 12pm',
          game: 'Football',
          teamMembers: 13,
          court: 'Court - A',
        },
        {
          date: '31-10-2024',
          slot: '1pm - 3pm',
          game: 'Basketball',
          teamMembers: 10,
          court: 'Court - B',
        },
      ],
    },
  ];

  return (
    <>
      <Breadcrumb pageName="Customers" />

      <form className='my-8'>
        <label
          htmlFor="search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Customers
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search Customer"
            required
          />
          <button
            type="submit"
            className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Search
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-10">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs font-semibold uppercase bg-primary text-white">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Customer Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Mobile Number
                </th>
                <th scope="col" className="px-6 py-3">
                  Date
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
                <th scope="col" className="px-6 py-3 text-center">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, customerIndex) =>
                customer.bookings.map((booking, bookingIndex) => (
                  <tr
                    key={`${customerIndex}-${bookingIndex}`}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    {bookingIndex === 0 ? (
                      <>
                        <th
                          rowSpan={customer.bookings.length}
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {customer.name}
                        </th>
                        <td
                          rowSpan={customer.bookings.length}
                          className="px-6 py-4"
                        >
                          {customer.mobile}
                        </td>
                      </>
                    ) : null}
                    <td className="px-6 py-4">{booking.date}</td>
                    <td className="px-6 py-4">{booking.slot}</td>
                    <td className="px-6 py-4">{booking.game}</td>
                    <td className="px-6 py-4">{booking.teamMembers}</td>
                    <td className="px-6 py-4">{booking.court}</td>
                    <td className="px-6 py-4 text-right">
                      <a
                        href="#"
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        Edit
                      </a>
                    </td>
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Customers;
