// pages/OwnerDashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../Authcontext.jsx";
import { useNavigate } from "react-router-dom";
import "../styles/ownerDash.css";
import "../styles/global.css";

export default function OwnerDash() {
  const { user, isOwner } = useAuth();
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState([]);
  const [stats, setStats] = useState({
    totalFacilities: 0,
    todayBookings: 0,
    monthlyRevenue: 0,
    pendingApprovals: 0
  });

  const facilitiesSectionRef = useRef(null);

  // Redirect if not owner
  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    if (!isOwner()) {
      navigate('/');
      return;
    }
    
    // Fetch owner data with dummy data
    fetchOwnerData();
  }, [user, isOwner, navigate]);

  useEffect(() => {
    fetchOwnerData();
  }, []);

  const fetchOwnerData = async () => {
    try {
      // Dummy data for demonstration
      const dummyFacilities = [
        {
          id: 1,
          name: "Elite Sports Complex",
          location: "Karachi, DHA",
          sports: ["Badminton", "Tennis", "Squash"],
          todayBookings: 8,
          status: "active"
        },
        {
          id: 2,
          name: "City Sports Arena",
          location: "Lahore, Gulberg",
          sports: ["Football", "Cricket"],
          todayBookings: 12,
          status: "active"
        },
        {
          id: 3,
          name: "Champion Court",
          location: "Islamabad, F-8",
          sports: ["Basketball", "Volleyball"],
          todayBookings: 5,
          status: "pending"
        }
      ];

      const dummyStats = {
        totalFacilities: 3,
        todayBookings: 25,
        monthlyRevenue: 125000,
        pendingApprovals: 1
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFacilities(dummyFacilities);
      setStats(dummyStats);
    } catch (error) {
      console.error("Error fetching owner data:", error);
      // Fallback dummy data in case of error
      setFacilities([]);
      setStats({
        totalFacilities: 0,
        todayBookings: 0,
        monthlyRevenue: 0,
        pendingApprovals: 0
      });
    }
  };

  const scrollToFacilities = () => {
    if (facilitiesSectionRef.current) {
      facilitiesSectionRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="owner-dashboard">
      {/* Owner-specific Navbar */}
      <nav className="owner-navbar">
        <div className="nav-brand">
          <span className="logo" onClick={() => navigate('/')}>Courtify</span>
          <span className="user-badge">Owner Portal</span>
        </div>
        
        <div className="nav-links">
          <button className="btn-primary btn" onClick={() => navigate('/owner/register-facility')}>
            + Add Facility
          </button>
          <span className="welcome-text">Welcome, {user?.name}</span>
          <button className="btn-outline btn" onClick={() => navigate('/')}>
            Back to Main Site
          </button>
        </div>
      </nav>

      <div className="owner-dashboard-content">
        <div className="dashboard-header">
          <h1>Business Dashboard</h1>
          <p>Manage your sports facilities and bookings</p>
        </div>

        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🏢</div>
            <h3>Total Facilities</h3>
            <p className="stat-number">{stats.totalFacilities}</p>
            <span className="stat-label">Registered venues</span>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <h3>Today's Bookings</h3>
            <p className="stat-number">{stats.todayBookings}</p>
            <span className="stat-label">Sessions booked</span>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <h3>Monthly Revenue</h3>
            <p className="stat-number">PKR {stats.monthlyRevenue.toLocaleString()}</p>
            <span className="stat-label">This month</span>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <h3>Pending</h3>
            <p className="stat-number">{stats.pendingApprovals}</p>
            <span className="stat-label">Approvals needed</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button 
              className="action-btn primary"
              onClick={() => navigate('/owner/register-facility')}
            >
              <span className="action-icon">+</span>
              <div className="action-text">
                <strong>Register New Facility</strong>
                <small>Add a new sports venue</small>
              </div>
            </button>
            <button 
              className="action-btn secondary"
              onClick={scrollToFacilities}
            >
              <span className="action-icon">🏢</span>
              <div className="action-text">
                <strong>Manage Facilities</strong>
                <small>View and edit all venues</small>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Facilities */}
        <div className="recent-facilities" ref={facilitiesSectionRef}>
          <div className="section-header">
            <h2>Your Facilities</h2>
            <button 
              className="btn-text btn"
              onClick={() => navigate('/owner/facilities')}
            >
              View All →
            </button>
          </div>
          
          {facilities.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏢</div>
              <h3>No facilities registered yet</h3>
              <p>Start by registering your first sports facility to get bookings</p>
              <button 
                className="btn-primary btn"
                onClick={() => navigate('/owner/register-facility')}
              >
                Register Your First Facility
              </button>
            </div>
          ) : (
            <div className="facilities-grid">
              {facilities.map(facility => (
                <div key={facility.id} className={`facility-card ${facility.status}`}>
                  <div className="facility-header">
                    <h4>{facility.name}</h4>
                    <span className={`status-badge ${facility.status}`}>
                      {facility.status}
                    </span>
                  </div>
                  <p className="facility-location">{facility.location}</p>
                  <div className="sports-tags">
                    {facility.sports.map(sport => (
                      <span key={sport} className="sport-tag">{sport}</span>
                    ))}
                  </div>
                  <div className="facility-stats">
                    <div className="stat">
                      <span className="stat-value">{facility.todayBookings}</span>
                      <span className="stat-label">Today's Bookings</span>
                    </div>
                  </div>
                  <div className="facility-actions">
                    <button className="btn-small btn">View Details</button>
                    <button className="btn-small outline btn">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}