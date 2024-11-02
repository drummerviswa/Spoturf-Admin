import { useState, ChangeEvent, FormEvent } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import axios from 'axios';

interface GamesAvailable {
  football: boolean;
  cricket: boolean;
  shuttle: boolean;
  basketball: boolean;
}

interface Amenities {
  parking: boolean;
  restroom: boolean;
  changingRoom: boolean;
  refreshments: boolean;
}

const Profile: React.FC = () => {
  const [formData, setFormData] = useState({
    turfName: 'VV Turf',
    address: '1244, 1245 TNHB, Avadi, Chennai - 600054',
    price: 400,
    maps: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d331.9775978208067!2d80.2082200593181!3d13.003414123491835!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52674259581a7f%3A0x18158de4f3854c54!2sAshok%20Manor%202%2C%20Margosa%20St%2C%20Ramapuram%2C%20Alandur%2C%20Chennai%2C%20Tamil%20Nadu%20600016!5e1!3m2!1sen!2sin!4v1730574316420!5m2!1sen!2sin',
    startTime: '09:00',
    endTime: '18:00',
    gamesAvailable: {
      football: true,
      cricket: true,
      shuttle: true,
      basketball: true,
    } as GamesAvailable,
    amenities: {
      parking: false,
      restroom: false,
      changingRoom: false,
      refreshments: false,
    } as Amenities,
    images: [
      'https://turftown.in/_next/image?url=https%3A%2F%2Fturftown.s3.ap-south-1.amazonaws.com%2Fsuper_admin%2Ftt-1724318861658.webp&w=640&q=75',
      'https://turftown.in/_next/image?url=https%3A%2F%2Fturftown.s3.ap-south-1.amazonaws.com%2Fsuper_admin%2Ftt-1709736019379.webp&w=1920&q=75',
      'https://turftown.in/_next/image?url=https%3A%2F%2Fturftown.s3.ap-south-1.amazonaws.com%2Fsuper_admin%2Ftt-1724324556497.webp&w=1920&q=75',
    ] as (File | string)[],
  });

  const CLOUDINARY_UPLOAD_URL =
    'cloudinary://971943342169448:6Wvr8uIB_D-0noQXjHqwgDxXQOo@dg1vtz08u';
  const UPLOAD_PRESET = 'spoturf-client';

  const handleImageChange = async (
    index: number,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);

      try {
        const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData);
        const imageUrl = response.data.secure_url;

        setFormData((prevData) => {
          const newImages = [...prevData.images];
          newImages[index] = imageUrl;
          return { ...prevData, images: newImages };
        });
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name in formData) {
      if (name === 'price') {
        setFormData((prevData) => ({ ...prevData, [name]: Number(value) }));
      } else {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
      }
    }
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    if (formData.gamesAvailable.hasOwnProperty(name)) {
      setFormData((prevData) => ({
        ...prevData,
        gamesAvailable: { ...prevData.gamesAvailable, [name]: checked },
      }));
    } else if (formData.amenities.hasOwnProperty(name)) {
      setFormData((prevData) => ({
        ...prevData,
        amenities: { ...prevData.amenities, [name]: checked },
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const {
      turfName,
      address,
      price,
      maps,
      startTime,
      endTime,
      gamesAvailable,
      amenities,
      images,
    } = formData;

    // Validate form data before submission
    if (
      !turfName ||
      !address ||
      price <= 0 ||
      !maps ||
      !startTime ||
      !endTime
    ) {
      alert('Please fill all required fields correctly.');
      return;
    }

    const formToSubmit = new FormData();
    formToSubmit.append('turfName', turfName);
    formToSubmit.append('address', address);
    formToSubmit.append('price', price.toString());
    formToSubmit.append('maps', maps);
    formToSubmit.append('startTime', startTime);
    formToSubmit.append('endTime', endTime);
    formToSubmit.append('gamesAvailable', JSON.stringify(gamesAvailable));
    formToSubmit.append('amenities', JSON.stringify(amenities));

    images.forEach((image, index) => {
      if (typeof image === 'string') {
        formToSubmit.append(`image${index + 1}`, image); // URL directly added
      }
    });

    const API_URL = 'https://mockapi.io/your-mock-endpoint';

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formToSubmit,
      });

      if (!response.ok) {
        throw new Error('Failed to save turf data');
      }

      const result = await response.json();
      console.log('Turf data saved successfully:', result);
      alert('Turf data saved successfully');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your data. Please try again later.');
    }
  };

  return (
    <>
      <Breadcrumb pageName="Profile" />
      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {formData.images.map((image, index) => (
            <div className="relative z-20 h-35 md:h-65" key={index}>
              <img
                src={
                  typeof image === 'object' ? URL.createObjectURL(image) : image
                }
                alt={`profile cover ${index + 1}`}
                className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
              />
              <div className="absolute bottom-1 right-1 z-10 xsm:bottom-4 xsm:right-4">
                <label
                  htmlFor={`cover-${index}`}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded bg-primary py-1 px-2 text-sm font-medium text-white hover:bg-opacity-90 xsm:px-4"
                >
                  <input
                    type="file"
                    id={`cover-${index}`}
                    className="sr-only"
                    accept="image/*"
                    onChange={(e) => handleImageChange(index, e)}
                  />
                  <span>Edit</span>
                </label>
              </div>
            </div>
          ))}
        </div>
        <section className="bg-white dark:bg-gray-900">
          <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="turfName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Turf Name
                  </label>
                  <input
                    type="text"
                    name="turfName"
                    id="turfName"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    value={formData.turfName}
                    onChange={handleChange}
                    placeholder="Type turf name"
                    required
                  />
                </div>
                <div className="w-full col-span-2">
                  <label
                    htmlFor="address"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Type turf address"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="price"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Price"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="category"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    id="category"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    value={formData.maps}
                    onChange={handleChange}
                    placeholder="Type turf category"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="startTime"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    id="startTime"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="endTime"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    End Time
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    id="endTime"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <h2 className="mb-4 text-lg font-semibold">Games Available</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {Object.entries(formData.gamesAvailable).map(
                  ([game, available]) => (
                    <div key={game} className="flex items-center">
                      <input
                        type="checkbox"
                        name={game}
                        checked={available}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <label
                        htmlFor={game}
                        className="ml-2 text-sm text-gray-900 dark:text-white capitalize"
                      >
                        {game}
                      </label>
                    </div>
                  ),
                )}
              </div>
              <h2 className="mb-4 text-lg font-semibold">Amenities</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {Object.entries(formData.amenities).map(
                  ([amenity, available]) => (
                    <div key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        name={amenity}
                        checked={available}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <label
                        htmlFor={amenity}
                        className="ml-2 text-sm text-gray-900 dark:text-white capitalize"
                      >
                        {amenity}
                      </label>
                    </div>
                  ),
                )}
              </div>
              <button
                type="submit"
                className="mt-4 inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-opacity-90 focus:outline-none"
              >
                Save
              </button>
            </form>
          </div>
        </section>
      </div>
    </>
  );
};

export default Profile;
