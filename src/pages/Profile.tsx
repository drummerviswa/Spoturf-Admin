import { useEffect, useState } from 'react';
import makeRequest from '../axios';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';

const Profile = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
  });
  const user = localStorage.getItem('user');
  const { AID } = JSON.parse(user);
  console.log('AID: ', AID);
  useEffect(() => {
    const fetchAdminDetails = async () => {
      if (!AID) {
        console.error('Admin ID not found in local storage');
        return;
      }

      try {
        const response = await makeRequest.get(`/admin/auth/details/${AID}`); // Use AID in the request
        setFormData(response.data);
      } catch (error) {
        console.error(
          'Error fetching admin details:',
          error.response?.data || error.message,
        );
      }
    };

    fetchAdminDetails();
  }, []);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!AID) {
        console.error('Admin ID not found in local storage');
        return;
    }

    try {
        const response = await makeRequest.put(`/admin/auth/${AID}`, formData); // Use AID in the update request
        console.log('Profile updated:', response.data);
        alert('Profile updated successfully!'); // Show alert on success
    } catch (error) {
        console.error(
            'Error updating profile:',
            error.response?.data || error.message,
        );
    }
};


  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Profile" />

        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Personal Information
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleSubmit}>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="name"
                      >
                        Name
                      </label>
                      <div className="relative">
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="name"
                          id="name"
                          placeholder="Name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="username"
                      >
                        Username
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                      type="submit"
                    >
                      Change
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <button
          type="button"
          className="text-primary m-4 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"
        >
          Contact admin
        </button>
      </div>
    </>
  );
};

export default Profile;
