import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { lazy } from "react";

import Checkin from "./ui/Checkin";
import AppLayout from "./ui/AppLayout";
import ProtectedRoute from "./ui/ProtectedRoute";
import { DarkModeProvider } from "./context/DarkModeContext";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Account = lazy(() => import("./pages/Account"));
const Bookings = lazy(() => import("./pages/Bookings"));
const Cabins = lazy(() => import("./pages/Cabins"));
const Login = lazy(() => import("./pages/Login"));
const Settings = lazy(() => import("./pages/Settings"));
const NewUsers = lazy(() => import("./pages/Users"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const Booking = lazy(() => import("./pages/Booking"));

// import Dashboard from "./pages/Dashboard";
// import Account from "./pages/Account";
// import Bookings from "./pages/Bookings";
// import Cabins from "./pages/Cabins";
// import Login from "./pages/Login";
// import Settings from "./pages/Settings";
// import NewUsers from "./pages/Users";
// import PageNotFound from "./pages/PageNotFound";
// import Booking from "./pages/Booking";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      // refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <DarkModeProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />

        <BrowserRouter>
          <Routes>
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate replace to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/account" element={<Account />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/bookings/:bookingId" element={<Booking />} />
              <Route path="/checkin/:bookingId" element={<Checkin />} />
              <Route path="/cabins" element={<Cabins />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/users" element={<NewUsers />} />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              duration: 3000,
              success: {
                duration: 3000,
              },
              error: {
                duration: 5000,
              },
              style: {
                maxWidth: "40rem",
                fontSize: "1.6rem",
                padding: "1.6rem 2.4rem",
                color: "var(--color-grey-700)",
                background: "var(--color-grey-0)",
              },
            }}
          />
        </BrowserRouter>
      </QueryClientProvider>
    </DarkModeProvider>
  );
}

export default App;
