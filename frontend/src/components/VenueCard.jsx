import React from "react";
import { useNavigate } from "react-router-dom";
import viteLogo from "../../public/vite.svg"; // Vite placeholder image
import "./VenueCard.css";

function VenueCard({
  id,
  name,
  location,
  pricePerHour,
  availability,
  rating,
  imagePath
}) {

  const naigate = useNavigate();

  // Function to get the image source
  const getImageSrc = () => {
    if (!imagePath) return viteLogo;
    
    try {
      // For images in your project (e.g., /src/assets/images/venue1.jpg)
      return new URL(imagePath, import.meta.url).href;
    } catch {
      return viteLogo;
    }
  };

  const handleCardClick = () => {
    naigate(`/venue/`, { state: { id } })
  }

  const handleBookNow = (e) => {
    e.stopPropagation();
    naigate(`/venue/`, { state: { id } });
  }

  return (
    <div className="venue-card card" onClick={handleCardClick}>
      <div className="venue-card-image-container">
        <img src={getImageSrc()} alt={name} className="venue-card-image" />
        <div className="venue-card-rating">★ {rating}</div>
      </div>

      <div className="venue-card-content">
        <h3 className="venue-card-title">{name}</h3>

        <div className="venue-card-location">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{location}</span>
        </div>

        <div className="venue-card-info">
          <div className="venue-card-info-item">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" cx="12" cy="12" r="10" />
              <polyline strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points="12 6 12 12 16 14" />
            </svg>
            <span>{availability}</span>
          </div>
        </div>

        <div className="venue-card-footer">
          <div className="venue-card-price">
            <span className="venue-card-price-amount">Rs.{pricePerHour}</span>
            <span className="venue-card-price-period">/hour</span>
          </div>

          <button className="venue-card-button btn" onClick={handleBookNow}>Book Now</button>
        </div>
      </div>
    </div>
  );
}

export default VenueCard;