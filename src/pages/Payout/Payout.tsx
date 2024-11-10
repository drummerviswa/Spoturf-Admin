import { useState, useEffect } from 'react';
import PaymentRow from './PaymentRow';
import * as XLSX from 'xlsx';

interface Payment {
  turfId: string; // Assuming turf ID is available
  turfName: string; // Turf Name
  bookingDate: string;
  amount: string;
  status: string;
}

interface Turf {
  id: string;
  name: string;
}

const Payout: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [turfOptions, setTurfOptions] = useState<Turf[]>([]);
  const [selectedTurf, setSelectedTurf] = useState<string>(''); // Selected turf ID
  const [sortOption, setSortOption] = useState<string>('Recent');

  useEffect(() => {
    // Sample data for turfs
    const sampleTurfs: Turf[] = [
      { id: '1', name: 'Turf A' },
      { id: '2', name: 'Turf B' },
      { id: '3', name: 'Turf C' },
    ];
    
    setTurfOptions(sampleTurfs);

    // Sample payments
    const samplePayments: Payment[] = [
      {
        turfId: '1',
        turfName: 'Turf A',
        bookingDate: '2022-02-07',
        amount: '₹59.00',
        status: 'Complete',
      },
      {
        turfId: '2',
        turfName: 'Turf B',
        bookingDate: '2022-01-09',
        amount: '₹59.00',
        status: 'Canceled',
      },
      {
        turfId: '1',
        turfName: 'Turf A',
        bookingDate: '2021-12-15',
        amount: '₹29.00',
        status: 'Complete',
      },
      {
        turfId: '3',
        turfName: 'Turf C',
        bookingDate: '2021-11-14',
        amount: '₹29.00',
        status: 'Pending',
      },
      {
        turfId: '2',
        turfName: 'Turf B',
        bookingDate: '2021-10-15',
        amount: '₹29.00',
        status: 'Complete',
      },
    ];

    setPayments(samplePayments);
  }, []);

  // Filter payments based on selected turf
  const filteredPayments = payments.filter(payment => payment.turfId === selectedTurf);

  // Sort payments based on selected sort option
  const sortedPayments = [...filteredPayments].sort((a, b) => {
    if (sortOption === 'Recent') {
      return new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime();
    } else if (sortOption === 'Status') {
      return a.status.localeCompare(b.status);
    }
    return 0;
  });

  const exportToXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(sortedPayments);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Payments');
    XLSX.writeFile(workbook, `Payout - ${new Date().toDateString()}.xlsx`);
  };

  return (
    <div className="max-w-screen-xl">
      <div className="mx-auto mt-8 px-2">
        <div className="sm:flex sm:items-center sm:justify-between flex-col sm:flex-row">
          <p className="flex-1 text-base font-bold text-gray-900 dark:text-white">
            Latest Payments for Selected Turf
          </p>

          <div className="mt-4 sm:mt-0">
            <div className="flex items-center justify-start sm:justify-end">
              <div className="flex items-center">
                <label className="mr-2 flex-shrink-0 text-sm font-medium text-gray-900 dark:text-white">
                  Select Turf:
                </label>
                <select
                  className="sm:mr-4 block w-full rounded-lg border p-1 pr-10 text-base outline-none focus:shadow sm:text-sm"
                  value={selectedTurf}
                  onChange={e => setSelectedTurf(e.target.value)}
                >
                  <option value="">Select a Turf</option>
                  {turfOptions.map(turf => (
                    <option key={turf.id} value={turf.id}>
                      {`${turf.id} - ${turf.name}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center ml-4">
                <label className="mr-2 flex-shrink-0 text-sm font-medium text-gray-900 dark:text-white">
                  Sort by:
                </label>
                <select
                  className="sm:mr-4 block w-full rounded-lg border p-1 pr-10 text-base outline-none focus:shadow sm:text-sm"
                  value={sortOption}
                  onChange={e => setSortOption(e.target.value)}
                >
                  <option>Recent</option>
                  <option>Status</option>
                </select>
              </div>

              <button
                type="button"
                className="inline-flex cursor-pointer items-center rounded-lg border border-gray-400 bg-white py-2 px-3 text-sm font-medium text-gray-800 shadow hover:bg-gray-100"
                onClick={exportToXLSX}
              >
                <svg
                  className="mr-1 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Export to XLSX
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border shadow">
          <table className="min-w-full border-separate border-spacing-y-2 border-spacing-x-2">
            <thead className="hidden border-b lg:table-header-group">
              <tr>
                <td className="py-4 text-sm font-medium text-gray-500 sm:px-6">
                  Turf Name
                </td>
                <td className="py-4 text-sm font-medium text-gray-500 sm:px-6">
                  Booking Date
                </td>
                <td className="py-4 text-sm font-medium text-gray-500 sm:px-6">
                  Amount
                </td>
                <td className="py-4 text-sm font-medium text-gray-500 sm:px-6">
                  Status
                </td>
              </tr>
            </thead>

            <tbody className="lg:border-gray-300">
              {sortedPayments.map((payment, index) => (
                <PaymentRow key={index} {...payment} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payout;
