// components/StatusBadge.js
const StatusBadge = ({ status }) => {
  const statusStyles = {
    Complete: 'bg-primary text-white',
    Pending: 'bg-lightTheme text-ternary',
    Canceled: 'bg-red-200 text-red-500',
  };

  return (
    <div className={`inline-flex items-center rounded-full py-1 px-2 text-xs font-medium ${statusStyles[status]}`}>
      {status}
    </div>
  );
};

export default StatusBadge;
