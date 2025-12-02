import React, { useState } from "react";
import { useAuth } from "../Authcontext.jsx";
import { Navbar } from "../components/NavBar";
import UserLogin from "./user_login";
import UserSignup from "./user_signup";
import "../styles/playerBooking.css";
import "../styles/global.css";

function Bookings() {
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const dummyBookings = [
    {
        bookingId: "BK001",
        arenaName: "Central Sports Arena",
        courtNumber: 3,
        bookingDate: "2025-12-05",
        startTime: "18:00",
        duration: 60,
        status: "confirmed"
    },
    {
        bookingId: "BK002",
        arenaName: "Elite Badminton Club",
        courtNumber: 1,
        bookingDate: "2025-12-08",
        startTime: "14:30",
        duration: 90,
        status: "pending"
    },
    {
        bookingId: "BK003",
        arenaName: "City Sports Complex",
        courtNumber: 5,
        bookingDate: "2025-11-28",
        startTime: "19:00",
        duration: 60,
        status: "confirmed"
    },
    {
        bookingId: "BK004",
        arenaName: "Champions Court",
        courtNumber: 2,
        bookingDate: "2025-11-25",
        startTime: "16:00",
        duration: 120,
        status: "cancelled"
    },
    {
        bookingId: "BK005",
        arenaName: "Central Sports Arena",
        courtNumber: 4,
        bookingDate: "2025-12-10",
        startTime: "10:00",
        duration: 60,
        status: "pending"
    },
    {
        bookingId: "BK006",
        arenaName: "Pro Badminton Arena",
        courtNumber: 2,
        bookingDate: "2025-11-20",
        startTime: "20:00",
        duration: 90,
        status: "confirmed"
    },
    {
        bookingId: "BK007",
        arenaName: "Elite Badminton Club",
        courtNumber: 3,
        bookingDate: "2025-11-15",
        startTime: "17:30",
        duration: 60,
        status: "cancelled"
    }
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case "confirmed":
        return "status-confirmed";
      case "pending":
        return "status-pending";
      case "cancelled":
        return "status-cancelled";
      default:
        return "";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleShowSignup = () => {
    setShowSignup(true);
  };

  const handleShowLogin = () => {
    setShowLogin(true);
  };

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

      <div className={`bookings-wrapper ${showLogin || showSignup ? "blurred" : ""}`}>
        <div className="bookings-container">
          <h1>My Bookings</h1>
          <div className="bookings-list">
            {dummyBookings.map((booking) => (
              <div key={booking.bookingId} className="booking-card">
                <div className="booking-header">
                  <h3>{booking.arenaName}</h3>
                  <span className={`status-badge ${getStatusClass(booking.status)}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
                <div className="booking-details">
                  <div className="detail-row">
                    <span className="detail-label">Booking ID:</span>
                    <span className="detail-value">{booking.bookingId}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Court:</span>
                    <span className="detail-value">Court {booking.courtNumber}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">{formatDate(booking.bookingDate)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Time:</span>
                    <span className="detail-value">{formatTime(booking.startTime)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Duration:</span>
                    <span className="detail-value">{booking.duration} minutes</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Bookings;