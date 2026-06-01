import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import PrivateRoute from './components/auth/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Dashboard from './pages/Dashboard';
import EventList from './pages/events/EventList';
import EventDetail from './pages/events/EventDetail';
import EventCreateEdit from './pages/events/EventCreateEdit';
import TrendingEvents from './pages/events/TrendingEvents';
import EventBookingPage from './pages/bookings/EventBookingPage';
import BookingDetail from './pages/bookings/BookingDetail';
import BookingHistory from './pages/bookings/BookingHistory';
import HallList from './pages/halls/HallList';
import HallBookingPage from './pages/halls/HallBookingPage';
import HallCreateEdit from './pages/halls/HallCreateEdit';
import HallManagement from './pages/halls/HallManagement';
import HallGuestManagement from './pages/halls/HallGuestManagement';
import DancePartnersPage from './pages/dance/DancePartnersPage';

const AppContent = () => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={
            <PrivateRoute><Profile /></PrivateRoute>
          } />
          <Route path="/profile/edit" element={
            <PrivateRoute><EditProfile /></PrivateRoute>
          } />
          <Route path="/dashboard" element={
            <PrivateRoute><Dashboard /></PrivateRoute>
          } />

          {/* Event routes */}
          <Route path="/events" element={<EventList />} />
          <Route path="/events/trending" element={<TrendingEvents />} />
          <Route path="/events/create" element={
            <PrivateRoute><EventCreateEdit /></PrivateRoute>
          } />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/events/:id/edit" element={
            <PrivateRoute><EventCreateEdit /></PrivateRoute>
          } />
          <Route path="/events/:id/book" element={<PrivateRoute><EventBookingPage /></PrivateRoute>} />
          <Route path="/bookings" element={<PrivateRoute><BookingHistory /></PrivateRoute>} />
          <Route path="/bookings/:bookingId" element={<PrivateRoute><BookingDetail /></PrivateRoute>} />
          
          {/* Hall routes */}
          <Route path="/halls" element={<HallList />} />
          <Route path="/halls/create" element={<PrivateRoute><HallCreateEdit /></PrivateRoute>} />
          <Route path="/halls/manage" element={<PrivateRoute><HallManagement /></PrivateRoute>} />
          <Route path="/halls/:id/edit" element={<PrivateRoute><HallCreateEdit /></PrivateRoute>} />
          <Route path="/halls/:hallId/manage" element={<PrivateRoute><HallGuestManagement /></PrivateRoute>} />
          <Route path="/halls/:id/book" element={<PrivateRoute><HallBookingPage /></PrivateRoute>} />
          
          <Route path="/dance-partners" element={<DancePartnersPage />} />
        </Routes>
      </main>
      
      {/* Premium Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <span className="text-2xl font-bold text-indigo-400">EventPro</span>
              <p className="mt-4 text-gray-400 max-w-xs">
                The ultimate platform for discovering and managing events. Making every gathering unforgettable.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/events" className="hover:text-indigo-400">Browse Events</a></li>
                <li><a href="/halls" className="hover:text-indigo-400">Venues</a></li>
                {user?.role === 'admin' ? (
                  <li><a href="/events/create" className="hover:text-indigo-400">Host an Event</a></li>
                ) : (
                  <li><a href="/events" className="hover:text-indigo-400">Explore Events</a></li>
                )}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Account</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/profile" className="hover:text-indigo-400">Profile</a></li>
                <li><a href="/dashboard" className="hover:text-indigo-400">Dashboard</a></li>
                <li><a href="/bookings" className="hover:text-indigo-400">My Bookings</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} EventPro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;