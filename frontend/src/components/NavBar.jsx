import { useNavigate } from "react-router-dom";
import React from "react";
import "./navbar.css";

export const Navbar = ({ onLoginClick, user }) => {

  const navigate = useNavigate();

  return (
    <nav className="navbar">
      {/* Left section */}
      <div className="nav-left">
        <div className="logo">
          <div className="logo-icon">⟳</div>
        </div>
        <span className="brand">Courtify</span>
      </div>

      {/* Right section */}
      <ul className="nav-right">
        <li onClick={() => navigate("/")}>Home</li>
        <li onClick={() => navigate("/venues")}>Venues</li>
        <li onClick={() => navigate("/bookings")}>Bookings</li>
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
