// components/PaymentRow.js
import StatusBadge from './StatusBadge';

const PaymentRow = ({ turfName, bookingDate, amount, status }) => {
  return (
    <tr>
      <td className="whitespace-no-wrap py-4 text-sm font-bold text-gray-900 sm:px-6 dark:text-white">
        {turfName}
        <div className="mt-1 lg:hidden">
          <p className="font-normal text-gray-500 dark:text-white">{bookingDate}</p>
        </div>
      </td>
      <td className="hidden py-4 text-sm font-normal text-gray-500 sm:px-6 lg:table-cell dark:text-white">
        {bookingDate}
      </td>
      <td className="whitespace-no-wrap py-4 px-6 text-right text-sm text-gray-600 dark:text-white lg:text-left">
        {amount}
      </td>
      <td className="hidden py-4 text-sm font-normal text-gray-500 dark:text-white sm:px-6 lg:table-cell">
        <StatusBadge status={status} />
      </td>
    </tr>
  );
};

export default PaymentRow;
