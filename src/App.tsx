import { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate, Link } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import Calendar from './pages/Booking/Calendar';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import DefaultLayout from './layout/DefaultLayout';
import HomePage from './pages/Dashboard/HomePage';
import BookingDetails from './pages/Booking/DailyDetails';
import Ratings from './pages/Ratings';
import Customers from './pages/Tables';
import Payout from './pages/Payout/Payout';
import Listing from './pages/Turfs/Listing';
import TurfDetail from './pages/Turfs/TurfDetail';
import CustomerDetails from './pages/CustomerDetils';
import Payments from './pages/Payment';
import SignUp from './pages/Authentication/SignUp';
import { useAuth } from './context/AuthContext';
import TurfBookings from './pages/Booking/TurfBookings';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  const { currentUser } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [currentUser]);

  if (loading) {
    return <Loader />;
  }

  if (!currentUser) {
    return (
      <Routes>
        <Route
          path="/login"
          element={
            <>
              <PageTitle title="Sign In | Spoturf - Admin" />
              <SignIn />
            </>
          }
        />
        <Route
          path="/auth/new/register"
          element={
            <>
              <PageTitle title="Sign Up | Spoturf - Admin" />
              <SignUp />
            </>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <DefaultLayout>
      <Routes>
        <Route
          index
          element={
            <>
              <PageTitle title="Dashboard | Spoturf - Admin" />
              <HomePage />
            </>
          }
        />
        <Route
          path="/turfs"
          element={
            <>
              <PageTitle title="Turfs | Spoturf - Admin" />
              <Listing />
            </>
          }
        />
        <Route
          path="/turfs/:id"
          element={
            <>
              <PageTitle title="Turf Detail | Spoturf - Admin" />
              <TurfDetail />
            </>
          }
        />
        <Route
          path="/booking"
          element={
            <>
              <PageTitle title="Booking Calendar | Spoturf - Admin" />
              <TurfBookings />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <PageTitle title="Profile | Spoturf - Admin" />
              <Profile />
            </>
          }
        />
        <Route
          path="/customers"
          element={
            <>
              <PageTitle title="Customers | Spoturf - Admin" />
              <Customers />
            </>
          }
        />
        <Route
          path="/customer/:id"
          element={
            <>
              <PageTitle title="Customer Details | Spoturf - Admin" />
              <CustomerDetails />
            </>
          }
        />
        <Route
          path="/payment"
          element={
            <>
              <PageTitle title="Payments | Spoturf - Admin" />
              <Payments />
            </>
          }
        />
        <Route
          path="/settings"
          element={
            <>
              <PageTitle title="Settings | Spoturf - Admin" />
              <Settings />
            </>
          }
        />
        <Route
          path="/ratings"
          element={
            <>
              <PageTitle title="Ratings | Spoturf - Admin" />
              <Ratings />
            </>
          }
        />
        <Route
          path="/payout"
          element={
            <>
              <PageTitle title="Payout | Spoturf - Admin" />
              <Payout />
            </>
          }
        />
        <Route
          path="/new"
          element={
            <>
              <PageTitle title="Sign Up | Spoturf - Admin" />
              <SignUp />
            </>
          }
        />
        <Route
          path="*"
          element={
            <section className="bg-white dark:bg-gray-900">
              <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center">
                  <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary dark:text-primary">
                    404
                  </h1>
                  <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
                    Something's missing.
                  </p>
                  <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
                    Sorry, we can't find that page. You'll find lots to explore on the home page.
                  </p>
                  <Link
                    to={'/'}
                    replace={true}
                    className="inline-flex text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4"
                  >
                    Back to Homepage
                  </Link>
                </div>
              </div>
            </section>
          }
        />
      </Routes>
    </DefaultLayout>
  );
}

export default App;
