import React, { useState } from "react";
import VenueCard from "../components/VenueCard";
import { SearchBar } from "../components/SearchBar";
import { Navbar } from "../components/NavBar";
import { useAuth } from "../Authcontext.jsx";
import UserLogin from "./user_login";
import UserSignup from "./user_signup";
import "../styles/dashboard.css";

import viteLogo from "../../public/vite.svg";


export default function Dashboard() {

  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const { user } = useAuth();

  const handleShowSignup = () => {
    setShowSignup(true);
  };

  const handleShowLogin = () => {
    setShowLogin(true);
  };

  const venues = [
    {
      id: 1,
      name: "Star Sports Arena",
      type: "Football",
      location: "Karachi",
      pricePerHour: 1500,
      capacity: 12,
      availability: "Open Today",
      rating: 4.8
    },
    {
      id: 2,
      name: "Mega Turf Ground",
      type: "Cricket",
      location: "Lahore",
      pricePerHour: 1800,
      capacity: 22,
      availability: "Available",
      rating: 4.6
    },
    {
      id: 3,
      name: "Champion's Court",
      type: "Tennis",
      location: "Islamabad",
      pricePerHour: 1200,
      capacity: 4,
      availability: "Fully Available",
      rating: 4.9
    },
    {
      id: 4,
      name: "Sports Hub",
      type: "Badminton",
      location: "Multan",
      pricePerHour: 800,
      capacity: 4,
      availability: "Open",
      rating: 4.4
    },
    {
      id: 5,
      name: "Elite Fitness Arena",
      type: "Basketball",
      location: "Karachi",
      pricePerHour: 1400,
      capacity: 10,
      availability: "Available",
      rating: 4.7
    },
    {
      id: 6,
      name: "City Sports Pavilion",
      type: "Volleyball",
      location: "Faisalabad",
      pricePerHour: 900,
      capacity: 8,
      availability: "Open",
      rating: 4.5
    },
    {
      id: 7,
      name: "Prime Cricket Ground",
      type: "Cricket",
      location: "Rawalpindi",
      pricePerHour: 2000,
      capacity: 24,
      availability: "Limited Slots",
      rating: 4.3
    },
    {
      id: 8,
      name: "Olympia Sports Complex",
      type: "Football",
      location: "Hyderabad",
      pricePerHour: 1600,
      capacity: 14,
      availability: "Fully Available",
      rating: 4.9
    },
    {
      id: 9,
      name: "Grand Court Arena",
      type: "Tennis",
      location: "Karachi",
      pricePerHour: 1100,
      capacity: 4,
      availability: "Open Today",
      rating: 4.6
    },
    {
      id: 10,
      name: "National Cricket Park",
      type: "Cricket",
      location: "Lahore",
      pricePerHour: 2200,
      capacity: 26,
      availability: "Available",
      rating: 4.8
    },
    {
      id: 11,
      name: "Urban Sports Zone",
      type: "Futsal",
      location: "Islamabad",
      pricePerHour: 1300,
      capacity: 10,
      availability: "Fully Available",
      rating: 4.7
    },
    {
      id: 12,
      name: "Metro Arena",
      type: "Badminton",
      location: "Multan",
      pricePerHour: 700,
      capacity: 4,
      availability: "Open",
      rating: 4.2
    },
    {
      id: 13,
      name: "Arena 360",
      type: "Basketball",
      location: "Lahore",
      pricePerHour: 1500,
      capacity: 12,
      availability: "Limited Slots",
      rating: 4.5
    },
    {
      id: 14,
      name: "PlayMax Sports Field",
      type: "Football",
      location: "Quetta",
      pricePerHour: 1200,
      capacity: 16,
      availability: "Available",
      rating: 4.6
    },
    {
      id: 15,
      name: "Superior Cricket Academy",
      type: "Cricket",
      location: "Peshawar",
      pricePerHour: 1900,
      capacity: 20,
      availability: "Open Today",
      rating: 4.4
    },
    {
      id: 16,
      name: "City Shuttle Arena",
      type: "Badminton",
      location: "Karachi",
      pricePerHour: 750,
      capacity: 4,
      availability: "Available",
      rating: 4.3
    }
  ];

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

      {/* Dashboard */}
      <div className={`dashboard-wrapper ${showLogin || showSignup ? "blurred" : ""}`}>

        <Navbar
          onLoginClick={() => setShowLogin(true)}
          user={user}
        />

        <section className="hero-section">
          <div className="hero-left">
            <h1>Find & Book Sports Venues Across Pakistan</h1>
            <p>Search courts, grounds, and arenas in your city. Play anytime, anywhere.</p>

            <div className="hero-search">
              <input type="text" placeholder="Search by city (Karachi, Lahore, Islamabad...)" />
              <button className="btn">Search</button>
            </div>
          </div>

          <div className="hero-right">
            <img src={viteLogo} alt="Sports Banner" />
          </div>
        </section>

        <div className="dashboard-header">
          <SearchBar />
        </div>

        <h1 className="dashboard-title">Available Venues</h1>

        <div className="venue-grid">
          {venues.map((venue) => (
            <VenueCard key={venue.id} {...venue} />
          ))}
        </div>
      </div>
    </>
  );
}
