import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './Authcontext.jsx';
import Dashboard from './pages/dashboard.jsx';
import OwnerDashboard from './pages/ownerDash';
import FacilityRegistration from './pages/facilityRegistration';
import OwnerFacilities from './pages/ownerFacilities';
import VenueDetail from './pages/venue_page.jsx';
import BookingPage from './pages/bookingVenue.jsx';
import PlayerBookings from './pages/playerBookings.jsx';
import AboutPage from './pages/about.jsx';

function AppRoutes () {
  const { user, isOwner } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Dashboard />} />
      <Route path="/venue" element={<VenueDetail />} />
      <Route path="/booking" element={<BookingPage />} />
      <Route path="/playerBook" element={<PlayerBookings />} />
      <Route path="/about" element={<AboutPage />} />


      {/* Owner protected routes */}
      <Route 
        path="/owner/dashboard" 
        element={isOwner() ? <OwnerDashboard /> : <Navigate to="/" />} 
      />
      <Route 
        path="/owner/register-facility" 
        element={isOwner() ? <FacilityRegistration /> : <Navigate to="/" />} 
      />
      <Route 
        path="/owner/facilities" 
        element={isOwner() ? <OwnerFacilities /> : <Navigate to="/" />} 
      />
    </Routes>
  );  
}

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        {/* <Routes>
          <Route path="/*" element={<PlayerBookings />} />
        </Routes> */}
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;