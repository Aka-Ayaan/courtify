import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Authcontext.jsx";
import UserLogin from "./user_login.jsx";
import { Navbar } from "../components/NavBar.jsx";
import "../styles/booking.css";
import "../styles/global.css";

function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  
  // Get venue data from navigation state or use default
  const venue = location.state?.venue || {
    id: 1,
    name: "Nisha Millets Swimming Academy @ Basecamp BCU",
    timing: "8 AM - 8 PM",
    courts: {
      "Swimming": ["Olympic Pool", "Training Pool", "Kids Pool"],
      "Aqua Aerobics": ["Main Pool"],
      "Diving": ["Diving Pool"]
    },
    sports: ["Swimming", "Aqua Aerobics", "Diving"],
    price: 250,
    description: "Premium swimming academy with professional trainers and well-maintained pool facilities."
  };

  // State for form fields
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedCourt, setSelectedCourt] = useState("");
  const [duration, setDuration] = useState("1 hr");
  const [quantity, setQuantity] = useState(1);

  // Generate time slots from venue timing
  const generateTimeSlots = () => {
    const slots = [];
    const [startTime, endTime] = venue.timing.split(" - ");
    
    // Convert to 24-hour format for easier calculation
    const startHour = convertTo24Hour(startTime);
    const endHour = convertTo24Hour(endTime);
    
    for (let hour = startHour; hour < endHour; hour++) {
      const start = convertTo12Hour(hour);
      const end = convertTo12Hour(hour + 1);
      slots.push(`${start} - ${end}`);
    }
    
    return slots;
  };

  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(" ");
    let [hours] = time.split(":");
    
    if (modifier === "PM" && hours !== "12") {
      hours = parseInt(hours, 10) + 12;
    }
    if (modifier === "AM" && hours === "12") {
      hours = 0;
    }
    
    return parseInt(hours, 10);
  };

  const convertTo12Hour = (hour24) => {
    const hour = hour24 % 12 || 12;
    const modifier = hour24 >= 12 ? "PM" : "AM";
    return `${hour}:00 ${modifier}`;
  };

  const timeSlots = generateTimeSlots();

  // Get available courts based on selected sport
  const availableCourts = selectedSport ? venue.courts[selectedSport] || [] : [];

  // Calculate total price
  const hours = parseInt(duration.split(" ")[0]);
  const totalPrice = venue.price * hours;

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  const handleProceedToPayment = () => {
    if (!user) {
      setShowLogin(true);
      return;
    }

    if (!selectedSport || !selectedDate || !selectedSlot || !selectedCourt) {
      alert("Please fill all the required fields");
      return;
    }

    // Proceed to payment
    console.log("Booking details:", {
      sport: selectedSport,
      date: selectedDate,
      slot: selectedSlot,
      court: selectedCourt,
      duration,
      quantity,
      totalPrice
    });

    // Navigate to payment page
    // navigate("/payment", { state: { bookingDetails: {...} } });
  };

  // Reset court when sport changes
  useEffect(() => {
    setSelectedCourt("");
  }, [selectedSport]);

  return (
    <>
      {/* Login Modal */}
      {showLogin && (
        <div className="modal-overlay">
          <UserLogin close={() => setShowLogin(false)} />
        </div>
      )}

      {/* Navbar */}
      <Navbar
        onLoginClick={() => setShowLogin(true)}
        user={user}
      />

      {/* Booking content */}
      <div className={`booking-wrapper ${showLogin ? "blurred" : ""}`}>
        <div className="booking-container">
          
          {/* Left Column - Booking Form */}
          <div className="booking-form-column">
            <div className="booking-header">
              <h1>Book Your Session: <div className="venue-name">{venue.name}</div></h1>
            </div>

            <div className="booking-card">
              {/* Sport Selection */}
              <div className="form-group">
                <label htmlFor="sport">Select Sport *</label>
                <select
                  id="sport"
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value)}
                  required
                >
                  <option value="">Choose a sport</option>
                  {(venue.sports || []).map((sport, index) => (
                    <option key={index} value={sport}>{sport}</option>
                  ))}
                </select>
              </div>

              {/* Date Selection */}
              <div className="form-group">
                <label htmlFor="date">Select Date *</label>
                <input
                  type="date"
                  id="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={today}
                  required
                />
              </div>

              {/* Time Slot Selection */}
              <div className="form-group">
                <label htmlFor="slot">Select Time Slot *</label>
                <select
                  id="slot"
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  required
                >
                  <option value="">Choose a time slot</option>
                  {timeSlots.map((slot, index) => (
                    <option key={index} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              {/* Court Selection */}
              <div className="form-group">
                <label htmlFor="court">Select Court/Location *</label>
                <select
                  id="court"
                  value={selectedCourt}
                  onChange={(e) => setSelectedCourt(e.target.value)}
                  disabled={!selectedSport}
                  required
                >
                  <option value="">Choose a court</option>
                  {availableCourts.map((court, index) => (
                    <option key={index} value={court}>{court}</option>
                  ))}
                </select>
                {!selectedSport && (
                  <p className="field-note">Please select a sport first</p>
                )}
              </div>

              {/* Duration */}
              <div className="form-group">
                <label htmlFor="duration">Duration</label>
                <select
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                >
                  <option value="1 hr">1 hour</option>
                  <option value="2 hrs">2 hours</option>
                  <option value="3 hrs">3 hours</option>
                </select>
              </div>

              {/* Quantity */}
              <div className="form-group">
                <label htmlFor="quantity">Number of People</label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                  ))}
                </select>
              </div>

              {/* Additional Info */}
              <div className="venue-description">
                <h3>About this venue</h3>
                <p>{venue.description}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="booking-summary-column">
            <div className="summary-card">
              <h2>Booking Summary</h2>
              
              <div className="summary-item">
                <span>Sport:</span>
                <span>{selectedSport || "Not selected"}</span>
              </div>

              <div className="summary-item">
                <span>Date:</span>
                <span>{selectedDate || "Not selected"}</span>
              </div>

              <div className="summary-item">
                <span>Time:</span>
                <span>{selectedSlot || "Not selected"}</span>
              </div>

              <div className="summary-item">
                <span>Court:</span>
                <span>{selectedCourt || "Not selected"}</span>
              </div>

              <div className="summary-item">
                <span>Duration:</span>
                <span>{duration}</span>
              </div>

              <div className="summary-item">
                <span>People:</span>
                <span>{quantity}</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-item total">
                <span>Total Amount:</span>
                <span>Rs. {totalPrice}</span>
              </div>

              {/* Proceed Button */}
              <button 
                className="btn proceed-btn" 
                onClick={handleProceedToPayment}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BookingPage;