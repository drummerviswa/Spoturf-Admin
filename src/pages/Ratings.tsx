import { useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';

type Review = {
  id: number;
  name: string;
  message: string;
  rating: number;
};

const sampleReviews: Review[] = [
  {
    id: 1,
    name: 'Danya R',
    message: "Turf was good, decent size, great prices, can't complain.",
    rating: 5,
  },
  {
    id: 2,
    name: 'Alex J',
    message: "The court was clean and well-maintained, but the staff could be more friendly.",
    rating: 4,
  },
  // Add more reviews as needed
];

export default function Ratings() {
  const [reviews, setReviews] = useState<Review[]>(sampleReviews);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState(0);

  // Handle search functionality
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter functionality
  const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterRating(Number(e.target.value));
  };

  // Filter reviews based on search term and rating
  const filteredReviews = reviews.filter(
    (review) =>
      review.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterRating === 0 || review.rating === filterRating)
  );

  return (
    <>
      <Breadcrumb pageName="Reviews" />
      <section className="bg-white rounded-xl py-8 antialiased dark:bg-meta-4 md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <div className="mx-auto max-w-5xl">
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
                    onChange={handleSearch}
                  />
                  <button
                    type="submit"
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
                  onChange={handleFilter}
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
                  <div key={review.id} className="grid md:grid-cols-12 gap-4 md:gap-6 rounded-xl my-4 px-8 py-4 md:py-6 dark:bg-black bg-meta-2">
                    <dl className="md:col-span-3 order-3 md:order-1">
                      <dt className="sr-only">Reviewer:</dt>
                      <dd className="text-base font-semibold text-gray-900 dark:text-white">
                        {review.name}
                      </dd>
                    </dl>

                    <dl className="md:col-span-6 order-4 md:order-2">
                      <dt className="sr-only">Message:</dt>
                      <dd className="text-gray-500 dark:text-gray-400">
                        {review.message}
                      </dd>
                    </dl>

                    <div className="md:col-span-3 content-center order-1 md:order-3 flex items-center justify-between">
                      <dl>
                        <dt className="sr-only">Stars:</dt>
                        <dd className="flex items-center space-x-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <svg
                              key={i}
                              className="w-5 h-5 text-yellow-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z"></path>
                            </svg>
                          ))}
                        </dd>
                      </dl>
                      <button
                        type="button"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        <span className="sr-only">Actions</span>
                        <svg
                          className="h-6 w-6"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeWidth="4"
                            d="M6 12h.01m6 0h.01m5.99 0h.01"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
