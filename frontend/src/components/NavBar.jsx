import { useNavigate } from "react-router-dom";
import React from "react";
import "./navbar.css";
import { useAuth } from "../Authcontext";

import logo from "../logo.png";

export const Navbar = ({ onLoginClick, user }) => {

  const navigate = useNavigate();
  const { isPlayer } = useAuth();
  console.log("Navbar user:", user);
  console.log("Is player:", isPlayer());

  const handleBookingsClick = () => {
    if (!user) {
      // If user is not logged in, show login modal
      onLoginClick();
    } else if (!isPlayer()) {
      alert("Only players can access bookings page");
    } else {
      navigate("/playerBook");
    }
  };

  return (
    <nav className="navbar">
      {/* Left section */}
      <div className="nav-left">
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
        <span className="brand">Courtify</span>
      </div>

      {/* Right section */}
      <ul className="nav-right">
        <li onClick={() => navigate("/")}>Home</li>
        <li onClick={handleBookingsClick}>Bookings</li>
        <li onClick={() => navigate("/about")}>About</li>
        <div className="separator">|</div>
        {user ? (
          <li className="user-info btn">
            <span className="user-icon">👤</span>
            <span className="user-name">{user.name}</span>
          </li>
        ) : (
          <button className="btn login-btn" onClick={onLoginClick}>
            Login
          </button>
        )}
      </ul>
    </nav>
  );
};
