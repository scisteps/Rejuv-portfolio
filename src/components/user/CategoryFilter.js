// src/components/User/CategoryFilter.jsx
import React from 'react';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../../utils/geoData';
import './CategoryFilter.css';

const CategoryFilter = ({ selectedCategories, onToggleCategory, categories }) => {
  return (
    <div className="category-filter">
      <h3>📋 Categories</h3>
      <div className="filter-list">
        <div 
          className={`filter-item ${selectedCategories.length === 0 ? 'active' : ''}`}
          onClick={() => {
            categories.forEach(cat => {
              if (selectedCategories.includes(cat)) {
                onToggleCategory(cat);
              }
            });
          }}
        >
          <span className="filter-icon">🌐</span>
          <span className="filter-name">All Locations</span>
          <span className="filter-count">({categories.length})</span>
        </div>
        
        {categories.map(category => {
          const isSelected = selectedCategories.includes(category);
          return (
            <div 
              key={category}
              className={`filter-item ${isSelected ? 'active' : ''}`}
              onClick={() => onToggleCategory(category)}
              style={{
                borderLeft: isSelected ? `4px solid ${CATEGORY_COLORS[category]}` : 'none'
              }}
            >
              <span className="filter-icon">{CATEGORY_ICONS[category]}</span>
              <span className="filter-name">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </span>
              <span 
                className="filter-dot" 
                style={{ backgroundColor: CATEGORY_COLORS[category] }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;