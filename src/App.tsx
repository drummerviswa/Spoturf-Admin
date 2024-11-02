import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

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

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [authed, setAuthed] = useState<boolean>(false);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
    setTimeout(()=>setAuthed(true),1000)
  }, []);

  return loading ? (
    <Loader />
  ) : authed ? (
    <DefaultLayout>
      <Routes>
        <Route
          index
          element={
            <>
              <PageTitle title="eCommerce Dashboard | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <HomePage />
            </>
          }
        />
        <Route
          path="/booking"
          element={
            <>
              <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Calendar />
            </>
          }
        />
        <Route
          path="/booking/:date"
          element={
            <>
              <PageTitle title="Daily | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <BookingDetails />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Profile />
            </>
          }
        />
        <Route
          path="/customers"
          element={
            <>
              <PageTitle title="Tables | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Customers />
            </>
          }
        />
        <Route
          path="/settings"
          element={
            <>
              <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Settings />
            </>
          }
        />
        <Route
          path="/ratings"
          element={
            <>
              <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Ratings />
            </>
          }
        />
        <Route
          path="/payout"
          element={
            <>
              <PageTitle title="Payout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Payout />
            </>
          }
        />
      </Routes>
    </DefaultLayout>
  ) : (
    <Routes>
      <Route
        path="/auth/signin"
        element={
          <>
            <PageTitle title="Signin | TailAdmin - Tailwind CSS Admin Dashboard Template" />
            <SignIn />
          </>
        }
      />
    </Routes>
  );
}

export default App;
