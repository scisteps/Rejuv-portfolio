// src/components/CampusMap/SearchBar.jsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
import './SearchBar.css';

function SearchBar({ locations = [], onSelect }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);

  // Filter buildings by name (and category/type if present) as the user types
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return locations
      .filter((loc) =>
        loc.name?.toLowerCase().includes(q) ||
        loc.category?.toLowerCase().includes(q) ||
        loc.type?.toLowerCase().includes(q)
      )
      .slice(0, 8); // cap suggestions so the list stays usable
  }, [query, locations]);

  useEffect(() => {
    setIsOpen(results.length > 0);
    setActiveIndex(-1);
  }, [results]);

  // Close the dropdown when clicking outside the search bar
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (building) => {
    setQuery(building.name);
    setIsOpen(false);
    setActiveIndex(-1);
    if (onSelect) onSelect(building);
  };

  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0) {
        handleSelect(results[activeIndex]);
      } else if (results.length > 0) {
        handleSelect(results[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
    setActiveIndex(-1);
  };

  return (
    <div className="search-bar-container" ref={containerRef}>
      <div className="search-input-wrapper">
        <span className="search-icon" aria-hidden="true">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Search buildings, halls, colleges..."
          className="search-input"
          aria-label="Search campus locations"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          role="combobox"
        />
        {query && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={handleClear}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {isOpen && (
        <ul className="search-results" role="listbox">
          {results.map((building, index) => (
            <li
              key={building.id}
              role="option"
              aria-selected={index === activeIndex}
              className={`search-result-item ${index === activeIndex ? 'active' : ''}`}
              onMouseDown={() => handleSelect(building)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <span className="result-name">{building.name}</span>
              {(building.category || building.type) && (
                <span className="result-category">
                  {building.category || building.type}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {isOpen && results.length === 0 && query.trim() && (
        <div className="search-no-results">No locations found</div>
      )}
    </div>
  );
}

export default SearchBar;
