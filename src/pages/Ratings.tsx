import { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import makeRequest from '../axios';

type Review = {
  RID: number;
  name: string;
  message: string;
  rating: number;
};

type Turf = {
  TID: number;
  turfName: string;
  reviews: Review[];
};

const Ratings = () => {
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [selectedTurf, setSelectedTurf] = useState<{
    TID: number | null;
    turfName: string;
  }>({ TID: null, turfName: '' });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState(0);

  // Fetch turfs when the component mounts
  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        const response = await makeRequest.get('/turfs');
        setTurfs(response.data);
      } catch (error) {
        console.error('Error fetching turfs:', error);
      }
    };

    fetchTurfs();
  }, []);

  const fetchReviews = async (TID: number) => {
    try {
      const response = await makeRequest.get(`/reviews/${TID}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const addReview = async (newReview: Omit<Review, 'RID'>) => {
    try {
      const response = await makeRequest.post('/reviews', newReview);
      setReviews((prev) => [
        ...prev,
        { ...newReview, RID: response.data.reviewId },
      ]);
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const deleteReview = async (RID: number) => {
    try {
      await makeRequest.delete(`/reviews/${RID}`);
      setReviews((prev) => prev.filter((review) => review.RID !== RID));
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleTurfSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    const selectedTurf = turfs.find((turf) => turf.TID === selectedId);
    setSelectedTurf({
      TID: selectedId,
      turfName: selectedTurf ? selectedTurf.turfName : '',
    });
    setSearchTerm('');
    setFilterRating(0);
    if (selectedId) {
      fetchReviews(selectedId);
    } else {
      setReviews([]);
    }
  };

  const filteredReviews = reviews.filter(
    (review) =>
      review.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterRating === 0 || review.rating === filterRating),
  );

  return (
    <>
      <Breadcrumb pageName="Reviews" />
      <section className="bg-white rounded-xl py-8 antialiased dark:bg-meta-4 md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4">
              <div className="w-full md:w-1/2">
                <label
                  htmlFor="turf-select"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Select Turf
                </label>
                <select
                  id="turf-select"
                  className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  onChange={handleTurfSelection}
                  value={selectedTurf.TID ?? ''}
                >
                  <option value="">Select a Turf</option>
                  {turfs.map((turf) => (
                    <option key={turf.TID} value={turf.TID}>
                      {`${turf.TID} - ${turf.turfName}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filteredReviews.length ? (
              selectedTurf.TID && (
                <>
                  <h2 className="mt-6 text-xl font-semibold">
                    {selectedTurf.turfName} Reviews
                  </h2>
                  <div className="gap-4 sm:flex sm:items-center sm:justify-between">
                    <form className="w-full">
                      <label
                        htmlFor="default-search"
                        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                      >
                        Search
                      </label>
                      <div className="relative">
                        <input
                          type="search"
                          id="default-search"
                          className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Search Reviews"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button
                          type="button"
                          className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                          Search
                        </button>
                      </div>
                    </form>

                    <div className="mt-6 sm:mt-0">
                      <label
                        htmlFor="order-type"
                        className="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Select review type
                      </label>
                      <select
                        id="order-type"
                        className="block w-full min-w-[8rem] rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                        onChange={(e) =>
                          setFilterRating(Number(e.target.value))
                        }
                      >
                        <option value={0}>All reviews</option>
                        <option value={5}>5 stars</option>
                        <option value={4}>4 stars</option>
                        <option value={3}>3 stars</option>
                        <option value={2}>2 stars</option>
                        <option value={1}>1 star</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6 flow-root sm:mt-8">
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredReviews.map((review) => (
                        <div
                          key={review.RID}
                          className="grid md:grid-cols-12 gap-4 md:gap-6 rounded-xl my-4 px-8 py-4 md:py-6 dark:bg-black bg-meta-2"
                        >
                          <dl className="md:col-span-3 order-3 md:order-1">
                            <dd className="text-base font-semibold text-gray-900 dark:text-white">
                              {review.name}
                            </dd>
                          </dl>

                          <dl className="md:col-span-7 order-1 md:order-2">
                            <dt className="sr-only">Message:</dt>
                            <dd className="font-medium text-gray-900 dark:text-white">
                              {review.message}
                            </dd>
                            <dt className="sr-only">Rating:</dt>
                            <dd className="font-medium text-gray-900 dark:text-white">
                              {review.rating}⭐
                            </dd>
                          </dl>
                          <div className="md:col-span-2 flex justify-end order-2 md:order-3">
                            <button
                              onClick={() => deleteReview(review.RID)}
                              className="text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )
            ) : (
              <p className="text-gray-500 dark:text-gray-400 mt-4">
                No reviews available for this turf.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Ratings;
