import { useState, ChangeEvent, FormEvent } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import axios from 'axios';
import Slots from '../../components/Slots';

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

const TurfDetail: React.FC = () => {
  const [formData, setFormData] = useState({
    turfName: 'VV Turf',
    address: '1244, 1245 TNHB, Avadi, Chennai - 600054',
    area:"Avadi",
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
      <div className="overflow-hidden rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="grid grid-cols-1 p-4 md:grid-cols-3 gap-4">
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
        <form onSubmit={handleSubmit}>
          <section className="bg-white dark:bg-gray-900">
            <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
              <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="turfName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Turf Name
                  </label>
                  <input
                    type="text"
                    id="turfName"
                    name="turfName"
                    value={formData.turfName}
                    onChange={handleChange}
                    required
                    className="block w-full px-4 py-2 text-sm border rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="area"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Area
                  </label>
                  <input
                    type="text"
                    id="area"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    required
                    className="block w-full px-4 py-2 text-sm border rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="address"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="block w-full px-4 py-2 text-sm border rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="price"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Price per Hour
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    onWheel={(e) => e.target.blur()}
                    required
                    className="block w-full px-4 py-2 text-sm border rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="maps"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Maps Link
                  </label>
                  <input
                    type="url"
                    id="maps"
                    name="maps"
                    value={formData.maps}
                    onChange={handleChange}
                    required
                    className="block w-full px-4 py-2 text-sm border rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="startTime"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Start Time
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                    className="block w-full px-4 py-2 text-sm border rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="endTime"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    End Time
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                    className="block w-full px-4 py-2 text-sm border rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>
              </div>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-300">Games Available</h2>
                {Object.keys(formData.gamesAvailable).map((game) => (
                  <div key={game} className="flex items-center">
                    <input
                      type="checkbox"
                      id={game}
                      name={game}
                      checked={formData.gamesAvailable[game as keyof GamesAvailable]}
                      onChange={handleCheckboxChange}
                      className="mr-2"
                    />
                    <label htmlFor={game} className="text-sm text-gray-900 dark:text-gray-300">
                      {game.charAt(0).toUpperCase() + game.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-300">Amenities</h2>
                {Object.keys(formData.amenities).map((amenity) => (
                  <div key={amenity} className="flex items-center">
                    <input
                      type="checkbox"
                      id={amenity}
                      name={amenity}
                      checked={formData.amenities[amenity as keyof Amenities]}
                      onChange={handleCheckboxChange}
                      className="mr-2"
                    />
                    <label htmlFor={amenity} className="text-sm text-gray-900 dark:text-gray-300">
                      {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
              <Slots />
              <button
                type="submit"
                className="mt-4 w-full px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary/70"
              >
                Save Profile
              </button>
            </div>
          </section>
        </form>
      </div>
    </>
  );
};

export default TurfDetail;
