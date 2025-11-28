import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Authcontext.jsx";
import { Navbar } from "../components/NavBar";
import "../styles/venue.css";
import "../styles/global.css";

import UserLogin from "./user_login";
import UserSignup from "./user_signup";

import viteLogo from "../../public/vite.svg";

function VenueDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const venueID = location.state;

  // Mock data - replace with actual API call
  const mockVenue = {
    id: 1,
    name: "Nisha Millets Swimming Academy @ Basecamp BCU",
    address: "Palace Road, Bengaluru",
    images: [
      viteLogo,
      viteLogo,
      viteLogo,
      viteLogo,
      viteLogo
    ],
    rating: 4.2,
    reviews: 12,
    price: 250,
    priceUnit: "hour",
    location: "Sports Block (behind Freedom park), Dr Marendra Singh Bengaluru City University, Palace Road, Bangalore - 560001 (Main Entrance gate next to Culinary)",
    sports: ["Swimming", "Aqua Aerobics", "Diving"],
    courts: {
      "Swimming": ["Olympic Pool", "Training Pool", "Kids Pool"],
      "Aqua Aerobics": ["Main Pool"],
      "Diving": ["Diving Pool"]
    },
    type: "Indoor Pool",
    timing: "8 AM - 9 PM",
    amenities: ["Changing Rooms", "Showers", "Locker", "Trainer", "Equipment"],
    description: "Premium swimming academy with professional trainers and well-maintained pool facilities.",
    rules: [
      "Swimming costume is mandatory",
      "Shower before entering the pool",
      "No diving in shallow areas",
      "Follow instructor guidelines"
    ]
  };

  const handleBookNow = () => { navigate("/booking", {state:{venue}}) };

  const formatPrice = (price) => {
    return `₹${price}/hour`;
  };

  const handleShowSignup = () => {
    setShowSignup(true);
  };

  const handleShowLogin = () => {
    setShowLogin(true);
  };

  // Query venue data based on ID
  // Use mockvenue for now until API is integrated
  const venue = mockVenue;

  return (
    <>
      {/* Modals */}
      {showLogin && (
        <div className="modal-overlay">
          <UserLogin 
            close={() => setShowLogin(false)} 
            showSignup={handleShowSignup} 
          />
        </div>
      )}

      {showSignup && (
        <div className="modal-overlay">
          <UserSignup 
            close={() => setShowSignup(false)} 
            showLogin={handleShowLogin} 
          />
        </div>
      )}

      <Navbar
        onLoginClick={() => setShowLogin(true)}
        user={user}
      />

      <div className={`venue-detail-wrapper ${showLogin || showSignup ? "blurred" : ""}`}>
        
        {/* Main Content Grid */}
        <div className="venue-layout-grid">
          
          {/* Left Column - Images */}
          <div className="venue-images-column">
            <h1>{venue.name}</h1>
            <div className="venue-address">{venue.address}</div>
            <div className="gallery-main">
              <img src={venue.images[0]} alt={venue.name} />
            </div>
            <div className="gallery-thumbnails">
              {venue.images.map((img, index) => (
                <img key={index} src={img} alt={`${venue.name} ${index + 1}`} />
              ))}
            </div>
          </div>

          {/* Right Column - Booking Info */}
          <div className="venue-booking-column">
            
            {/* Venue Header */}
            <div className="venue-header">
              <div className="venue-meta">
                <div className="venue-rating-price">
                  <span className="rating">⭐ {venue.rating} ({venue.reviews} ratings)</span>
                  <span className="price">{formatPrice(venue.price)}</span>
                </div>
              </div>
            </div>

            {/* Booking Card */}
            <div className="booking-card">
              <div className="booking-header">
                <h2>Book Now</h2>
                <button className="share-btn">Share ↗</button>
              </div>

              {/* Timing Section */}
              <div className="info-section">
                <h3>🕒 Timing</h3>
                <p>{venue.timing}</p>
              </div>

              {/* Location Section */}
              <div className="info-section">
                <h3>📍 Location</h3>
                <p>{venue.location}</p>
              </div>

              {/* Book Now Button */}
              <button className="book-now-btn-large btn" onClick={handleBookNow}>
                Book Now
              </button>
            </div>

            {/* Additional Actions */}
            <div className="action-buttons">
              <button className="action-btn">Search</button>
              <button className="action-btn">View Settings</button>
              <button className="action-btn">Save Settings</button>
            </div>

          </div>
        </div>

        {/* Additional Info Sections */}
        <section className="venue-description">
          <h2>About this venue</h2>
          <p>{venue.description}</p>
        </section>

        <section className="amenities-section">
          <h2>Amenities</h2>
          <div className="amenities-grid">
            {venue.amenities.map((amenity, index) => (
              <div key={index} className="amenity-item">
                {amenity}
              </div>
            ))}
          </div>
        </section>

        <section className="venue-rules">
          <h2>Rules & Guidelines</h2>
          <ul>
            {venue.rules.map((rule, index) => (
              <li key={index}>{rule}</li>
            ))}
          </ul>
        </section>

      </div>
    </>
  );
}

export default VenueDetail;