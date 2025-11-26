import React from "react";
import viteLogo from "../../public/vite.svg"; // Vite placeholder image
import "./VenueCard.css";

function VenueCard({
  name = "Sample Venue",
  type = "Football",
  location = "Karachi",
  pricePerHour = 500,
  capacity = 10,
  availability = "Available",
  rating = 4.5,
  image
}) {
  return (
    <div className="venue-card card">
      <div className="venue-card-image-container">
        <img src={image || viteLogo} alt={name} className="venue-card-image" />
        <div className="venue-card-badge">{type}</div>
        <div className="venue-card-rating">★ {rating}</div>
      </div>

      <div className="venue-card-content">
        <h3 className="venue-card-title">{name}</h3>

        <div className="venue-card-location">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{location}</span>
        </div>

        <div className="venue-card-info">
          <div className="venue-card-info-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
            <span>{capacity} players</span>
          </div>

          <div className="venue-card-info-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{availability}</span>
          </div>
        </div>

        <div className="venue-card-footer">
          <div className="venue-card-price">
            <span className="venue-card-price-amount">${pricePerHour}</span>
            <span className="venue-card-price-period">/hour</span>
          </div>

          <button className="venue-card-button btn">Book Now</button>
        </div>
      </div>
    </div>
  );
}

export default VenueCard;