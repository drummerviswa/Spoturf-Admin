import { useEffect, useState } from 'react';
import TurfList from '../../components/List';
import makeRequest from '../../axios';

type Turf = {
  TID: number;
  turfName: string;
  ownerName:string;
  mobileNo:string;
  area:string;
  address: string;
  price: number;
  maps: string; // Assuming this is a string URL or path
  startTime: string; // Assuming this is a string (e.g., '09:00 AM')
  endTime: string; // Assuming this is a string (e.g., '10:00 PM')
  gamesAvailable: string[]; // Assuming this is an array of strings
  amenities: string[]; // Assuming this is an array of strings
  images: []; // Assuming this is an array of string URLs
  status: 'Active' | 'Inactive';
  username: string; // Added username field
  password: string; // Added password field
};

export default function TurfListing() {
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTurf, setNewTurf] = useState<Omit<Turf, 'TID' | 'status' | 'created_at' | 'updated_at'>>({
    turfName: '',
    ownerName:'',
    mobileNo:'',
    area:"",
    address: '',
    price: 0,
    maps: '',
    startTime: '',
    endTime: '',
    gamesAvailable: [],
    amenities: [],
    images: [],
    username: '', // Added username field
    password: '', // Added password field - handle securely
  });

  const [filterStatus, setFilterStatus] = useState<'Active' | 'Inactive' | 'All'>('All');

  const filteredTurfs = turfs.filter(
    (turf) => filterStatus === 'All' || turf.status === filterStatus,
  );
  console.log(turfs);
  

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        const response = await makeRequest.get('/turfs');
        const images = JSON.parse(response.data.images || '[]');
        console.log('Fetched Turfs:', response.data); // Check the structure of the response
        setTurfs(response.data);
      } catch (error) {
        console.error('Error fetching turfs:', error);
      }
    };

    fetchTurfs();
  }, [filterStatus]); // Changed dependency to filterStatus for correct fetching

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setNewTurf({
      turfName: '',
      ownerName: '',
      mobileNo: '',
      area: '',
      address: '',
      price: 0,
      maps: '',
      startTime: '',
      endTime: '',
      gamesAvailable: [],
      amenities: [],
      images: [],
      username: '',
      password: ''
    });
    setIsAddModalOpen(false);
  };
  

  const handleAddTurf = async () => {
    try {
      const response = await makeRequest.post('/turfs', {
        ...newTurf,
        status: 'Active', // Setting default status to Active
      });
      console.log('New Turf Added:', response.data); // Log the new turf
      setTurfs([...turfs, response.data]); // Add the new turf returned from the server
      closeAddModal();
    } catch (error) {
      console.error('Error adding turf:', error);
    }
  };

  const handleRemoveTurf = async (id: number) => {
    if (window.confirm('Are you sure you want to remove this turf?')) {
      try {
        await makeRequest.delete(`/turfs/${id}`); // Adjusted endpoint
        setTurfs(turfs.filter((turf) => turf.TID !== id));
      } catch (error) {
        console.error('Error removing turf:', error);
      }
    }
  };

  const totalTurfs = filteredTurfs.length;

  return (
    <div>
      <div className="mb-4">
        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white py-2 px-4 rounded"
        >
          Add Turf
        </button>
      </div>

      <TurfList
        turfs={filteredTurfs}
        totalProducts={totalTurfs}
        onRemoveTurf={handleRemoveTurf}
      />

      {isAddModalOpen && (
        <div className="fixed z-9999 inset-0 overflow-auto no-scrollbar flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative p-2 w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Add New Turf
                </h3>
                <button
                  onClick={closeAddModal}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="p-4 space-y-2">
                <input
                  type="text"
                  placeholder="Turf Name"
                  value={newTurf.turfName}
                  onChange={(e) =>
                    setNewTurf({ ...newTurf, turfName: e.target.value })
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white mb-2"
                />
                <input
                  type="text"
                  placeholder="Owner Name"
                  value={newTurf.ownerName}
                  onChange={(e) =>
                    setNewTurf({ ...newTurf, ownerName: e.target.value })
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white mb-2"
                />
                <input
                  type="text"
                  placeholder="Mobile No"
                  value={newTurf.mobileNo}
                  onChange={(e) =>
                    setNewTurf({ ...newTurf, mobileNo: e.target.value })
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white mb-2"
                />
                <input
                  type="text"
                  placeholder="Area"
                  value={newTurf.area}
                  onChange={(e) =>
                    setNewTurf({ ...newTurf, area: e.target.value })
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white mb-2"
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={newTurf.address}
                  onChange={(e) =>
                    setNewTurf({ ...newTurf, address: e.target.value })
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white mb-2"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={newTurf.price}
                  onWheel={(e) => e.target.blur()}
                  onChange={(e) =>
                    setNewTurf({
                      ...newTurf,
                      price: parseFloat(e.target.value),
                    })
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white mb-2"
                />
                <input
                  type="text"
                  placeholder="Maps URL"
                  value={newTurf.maps}
                  onChange={(e) =>
                    setNewTurf({ ...newTurf, maps: e.target.value })
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white mb-2"
                />
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={newTurf.startTime}
                  onChange={(e) =>
                    setNewTurf({ ...newTurf, startTime: e.target.value })
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white mb-2"
                />
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={newTurf.endTime}
                  onChange={(e) =>
                    setNewTurf({ ...newTurf, endTime: e.target.value })
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white mb-2"
                />
                <input
                  type="text"
                  placeholder="Games Available (comma separated)"
                  value={newTurf.gamesAvailable.join(', ')}
                  onChange={(e) =>
                    setNewTurf({
                      ...newTurf,
                      gamesAvailable: e.target.value.split(',').map((game) => game.trim()),
                    })
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white mb-2"
                />
                <input
                  type="text"
                  placeholder="Amenities (comma separated)"
                  value={newTurf.amenities.join(', ')}
                  onChange={(e) =>
                    setNewTurf({
                      ...newTurf,
                      amenities: e.target.value.split(',').map((amenity) => amenity.trim()),
                    })
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white mb-2"
                />
                <input
                  type="text"
                  placeholder="Image URLs (comma separated)"
                  value={newTurf.images.join(', ')}
                  onChange={(e) =>
                    setNewTurf({
                      ...newTurf,
                      images: e.target.value.split(',').map((url) => url.trim()),
                    })
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white mb-2"
                />
                <input
                  type="text"
                  placeholder="Username"
                  value={newTurf.username}
                  onChange={(e) =>
                    setNewTurf({ ...newTurf, username: e.target.value })
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white mb-2"
                />
                {/* New Password Field */}
                <input
                  type="password"
                  placeholder="Password"
                  value={newTurf.password}
                  onChange={(e) =>
                    setNewTurf({ ...newTurf, password: e.target.value })
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white mb-2"
                />
              </div>
              <div className="flex items-center justify-end p-4 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                  onClick={handleAddTurf}
                  className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Add Turf
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
