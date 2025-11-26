import './SearchBar.css';

const SearchBar = () => {
  return (
    <div className="search-bar">
      <div className="search-input-container">
        <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          placeholder="Search venues by name, type, or location..."
          className="search-input"
        />
      </div>
      <button className="filter-button btn">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="4" x2="20" y1="21" y2="21"/>
          <line x1="4" x2="20" y1="9" y2="9"/>
          <line x1="4" x2="20" y1="15" y2="15"/>
          <line x1="4" x2="20" y1="3" y2="3"/>
          <line x1="9" x2="9" y1="21" y2="15"/>
          <line x1="15" x2="15" y1="9" y2="3"/>
        </svg>
        <span className="filter-button-text">Filters</span>
      </button>
    </div>
  );
};


export { SearchBar };