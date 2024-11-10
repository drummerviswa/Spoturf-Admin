import React, { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { useNavigate } from 'react-router-dom';
import makeRequest from '../axios';

interface Booking {
  date: string;
  slot: string;
  game: string;
  court: string;
  paymentAmount: string;
  paymentMethod: string;
}

interface Customer {
  CID: number;
  name: string;
  mobileNo: string;
  bookings: Booking[];
}

const Customers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await makeRequest.get('/customers');
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };
    fetchCustomers();
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Implement search logic (if needed)
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (customerId: number) => {
    navigate(`/customer/${customerId}`); // Navigate to the customer detail page
  };

  return (
    <>
      <Breadcrumb pageName="Customers" />
      <form className='my-8' onSubmit={handleSearch}>
        {/* ... rest of the form ... */}
      </form>

      <div className="flex flex-col gap-10">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs font-semibold uppercase bg-primary text-white">
              <tr>
                <th scope="col" className="px-6 py-3">Customer Name</th>
                <th scope="col" className="px-6 py-3">Mobile Number</th>
                <th scope="col" className="px-6 py-3">Bookings</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.CID} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{customer.name}</td>
                  <td className="px-6 py-4">{customer.mobileNo}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleViewDetails(customer.CID)} // Pass the customer ID
                      className="bg-blue-500 text-white py-1 px-2 rounded"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Customers;
