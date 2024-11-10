import React, { useEffect, useState } from 'react';
import makeRequest from '../axios';

type Turf = {
  TID: number;
  turfName: string;
  ownerName: string;
  mobileNo: string;
  area: string;
  address: string;
  price: number;
  maps: string; // Assuming this is a string URL or path
  startTime: string; // Assuming this is a string (e.g., '09:00 AM')
  endTime: string; // Assuming this is a string (e.g., '10:00 PM')
  gamesAvailable: string[]; // Assuming this is an array of strings
  amenities: string[]; // Assuming this is an array of strings
  images: string[]; // Assuming this is an array of string URLs
  status: 'Active' | 'Inactive';
  username: string; // Added username field
  password: string; // Added password field
};

type Props = {
  turfs: Turf[];
  totalProducts: number;
  onRemoveTurf: (id: number) => void;
};

const TurfList: React.FC<Props> = ({ turfs, totalProducts, onRemoveTurf }) => {
  const [filteredTurfs, setFilteredTurfs] = useState<Turf[]>(turfs);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedTurf, setEditedTurf] = useState<Turf | null>(null);

  useEffect(() => {
    setFilteredTurfs(turfs);
  }, [turfs]);

  useEffect(() => {
    const lowerCaseSearch = search.toLowerCase();
    setFilteredTurfs(
      lowerCaseSearch
        ? turfs.filter(
            (turf) =>
              turf.turfName.toLowerCase().includes(lowerCaseSearch) ||
              turf.area.toLowerCase().includes(lowerCaseSearch) ||
              turf.address.toLowerCase().includes(lowerCaseSearch) ||
              turf.TID.toString().includes(lowerCaseSearch),
          )
        : turfs,
    );
  }, [search, turfs]);

  const toggleStatus = async (id: number) => {
    const turfToUpdate = filteredTurfs.find((turf) => turf.TID === id);
    if (turfToUpdate) {
      const newStatus =
        turfToUpdate.status === 'Active' ? 'Inactive' : 'Active';

      try {
        const response = await makeRequest.put(`/turfs/status/${id}`, {
          status: newStatus,
        });
        if (response.status === 200) {
          setFilteredTurfs((prevTurfs) =>
            prevTurfs.map((turf) =>
              turf.TID === id ? { ...turf, status: newStatus } : turf,
            ),
          );
        } else {
          console.error('Failed to update status:', response.data);
        }
      } catch (error) {
        console.error('Error updating status:', error);
      }
    }
  };

  const openModal = (turf: Turf) => {
    setEditedTurf(turf);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditedTurf(null);
  };

  const handleSaveChanges = async () => {
    if (editedTurf) {
      try {
        const response = await makeRequest.put(
          `/turfs/full/${editedTurf.TID}`,
          editedTurf,
        );

        if (response.status === 200) {
          setFilteredTurfs((prevTurfs) =>
            prevTurfs.map((turf) =>
              turf.TID === editedTurf.TID ? editedTurf : turf,
            ),
          );
          closeModal();
          console.log('Update in DB');
        } else {
          console.error('Failed to update turf:', response.data);
        }
      } catch (error) {
        console.error('Error updating turf:', error);
      }
    }
  };

  const removeTurf = (id: number) => {
    if (window.confirm('Are you sure you want to remove this turf?')) {
      onRemoveTurf(id);
      setFilteredTurfs((prevTurfs) =>
        prevTurfs.filter((turf) => turf.TID !== id),
      );
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-3 sm:py-5 rounded-xl">
      <div className="px-4 mx-auto max-w-screen-2xl lg:px-6">
        <div className="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
          <div className="flex flex-col px-4 py-3 space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
            <div className="flex items-center flex-1 space-x-4">
              <h5>
                <span className="text-gray-500">Total Turfs:</span>
                <span className="dark:text-white"> {totalProducts}</span>
              </h5>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Turf Name..."
                className="px-3 py-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div className="overflow-x-auto no-scrollbar">
            {filteredTurfs.length > 0 ? (
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="row" className="px-4 py-2">
                      ID
                    </th>
                    <th className="px-4 py-2">Image</th>
                    <th className="px-4 py-2">Turf Name</th>
                    <th className="px-4 py-2">Owner Name</th>
                    <th className="px-4 py-2">Mobile No</th>
                    <th className="px-4 py-2">Area</th>
                    <th className="px-4 py-2">Address</th>
                    <th className="px-4 py-2">Price</th>
                    <th className="px-4 py-2">Maps</th>
                    <th className="px-4 py-2">Start Time</th>
                    <th className="px-4 py-2">End Time</th>
                    <th className="px-4 py-2">Username</th>
                    <th className="px-4 py-2">Password</th>
                    <th className="px-4 py-2">Games Available</th>
                    <th className="px-4 py-2">Amenities</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTurfs.map((turf) => (
                    <tr
                      key={turf.TID}
                      className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm whitespace-nowrap"
                    >
                      <td className="px-4 py-2 dark:text-white">{turf.TID}</td>
                      <td className="px-4 py-2">
                        <div className="carousel rounded-box w-64">
                          {turf.images.length > 0 &&
                            turf.images.map((i) => (
                              <div className="carousel-item w-full">
                                <img
                                  src={i}
                                  alt={'Nothing'}
                                  className="w-16 h-16 object-cover rounded"
                                />
                              </div>
                            ))}
                        </div>
                      </td>
                      <td className="px-4 py-2 dark:text-white">
                        {turf.turfName}
                      </td>
                      <td className="px-4 py-2 dark:text-white">
                        {turf.ownerName}
                      </td>
                      <td className="px-4 py-2 dark:text-white">
                        {turf.mobileNo}
                      </td>
                      <td className="px-4 py-2 dark:text-white">{turf.area}</td>
                      <td className="px-4 py-2 dark:text-white">
                        {turf.address}
                      </td>
                      <td className="px-4 py-2 dark:text-white">
                        {turf.price}
                      </td>
                      <td className="px-4 py-2 dark:text-white">{turf.maps}</td>
                      <td className="px-4 py-2 dark:text-white">
                        {turf.startTime}
                      </td>
                      <td className="px-4 py-2 dark:text-white">
                        {turf.endTime}
                      </td>
                      <td className="px-4 py-2 dark:text-white">
                        {turf.username}
                      </td>
                      <td className="px-4 py-2 dark:text-white">
                        {turf.password}
                      </td>
                      <td className="px-4 py-2 dark:text-white">
                        {turf.gamesAvailable.join(', ')}
                      </td>
                      <td className="px-4 py-2 dark:text-white">
                        {turf.amenities.join(', ')}
                      </td>
                      <td className="px-4 py-2">
                        <button
                          className={`px-2 py-1 text-white rounded ${
                            turf.status === 'Active'
                              ? 'bg-green-600'
                              : 'bg-red-600'
                          }`}
                          onClick={() => toggleStatus(turf.TID)}
                        >
                          {turf.status}
                        </button>
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => openModal(turf)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeTurf(turf.TID)}
                          className="ml-2 text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-4">No turfs found.</div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Editing Turf */}
      {isModalOpen && editedTurf && (
        <div className="fixed inset-0 flex items-center justify-center z-9999 h-screen bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-3/4 md:w-1/2 lg:w-1/3 h-5/6 overflow-y-auto no-scrollbar">
            <h2 className="text-lg font-semibold mb-4">Edit Turf</h2>
            <div className="mb-4">
              <label htmlFor="turfName" className="block mb-1">
                Turf Name
              </label>
              <input
                type="text"
                id="turfName"
                value={editedTurf.turfName}
                onChange={(e) =>
                  setEditedTurf({ ...editedTurf, turfName: e.target.value })
                }
                className="input-field"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="ownerName" className="block mb-1">
                Owner Name
              </label>
              <input
                type="text"
                id="ownerName"
                value={editedTurf.ownerName}
                onChange={(e) =>
                  setEditedTurf({ ...editedTurf, ownerName: e.target.value })
                }
                className="input-field"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="mobileNo" className="block mb-1">
                Mobile No
              </label>
              <input
                type="text"
                id="mobileNo"
                value={editedTurf.mobileNo}
                onChange={(e) =>
                  setEditedTurf({ ...editedTurf, mobileNo: e.target.value })
                }
                className="input-field"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="area" className="block mb-1">
                Area
              </label>
              <input
                type="text"
                id="area"
                value={editedTurf.area}
                onChange={(e) =>
                  setEditedTurf({ ...editedTurf, area: e.target.value })
                }
                className="input-field"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="address" className="block mb-1">
                Address
              </label>
              <input
                type="text"
                id="address"
                value={editedTurf.address}
                onChange={(e) =>
                  setEditedTurf({ ...editedTurf, address: e.target.value })
                }
                className="input-field"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="price" className="block mb-1">
                Price
              </label>
              <input
                type="number"
                onWheel={(e) => e.target.blur()}
                id="price"
                value={editedTurf.price}
                onChange={(e) =>
                  setEditedTurf({
                    ...editedTurf,
                    price: Number(e.target.value),
                  })
                }
                className="input-field"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="maps" className="block mb-1">
                Maps
              </label>
              <input
                type="text"
                id="maps"
                value={editedTurf.maps}
                onChange={(e) =>
                  setEditedTurf({ ...editedTurf, maps: e.target.value })
                }
                className="input-field"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="startTime" className="block mb-1">
                Start Time
              </label>
              <input
                type="text"
                id="startTime"
                value={editedTurf.startTime}
                onChange={(e) =>
                  setEditedTurf({ ...editedTurf, startTime: e.target.value })
                }
                className="input-field"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="endTime" className="block mb-1">
                End Time
              </label>
              <input
                type="text"
                id="endTime"
                value={editedTurf.endTime}
                onChange={(e) =>
                  setEditedTurf({ ...editedTurf, endTime: e.target.value })
                }
                className="input-field"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="username" className="block mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={editedTurf.username}
                onChange={(e) =>
                  setEditedTurf({ ...editedTurf, username: e.target.value })
                }
                className="input-field"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={editedTurf.password}
                onChange={(e) =>
                  setEditedTurf({ ...editedTurf, password: e.target.value })
                }
                className="input-field"
              />
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="mr-3 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TurfList;
