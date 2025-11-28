import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Authcontext.jsx";
import Dashboard from "./pages/dashboard.jsx";
import VenueDetail from "./pages/venue_page.jsx";
import BookingPage from "./pages/booking_page.jsx";
import "./styles/global.css";

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/venue" element={<VenueDetail />} />
          <Route path="/booking" element={<BookingPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;