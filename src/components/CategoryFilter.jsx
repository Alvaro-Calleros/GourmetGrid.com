import React, { useState, useEffect } from 'react';

const CategoryFilter = ({ onSelectCategory, API_BASE_URL }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}categories.php`);
        const data = await response.json();
        if (data.categories) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error('Error cargando categorías:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [API_BASE_URL]);

  return (
    <div className="category-filter">
      <h3 className="filter-title">Categorías</h3>
      {loading ? (
        <p>Cargando categorías...</p>
      ) : (
        <div className="category-grid">
          {categories.map((category) => (
            <button
              key={category.idCategory}
              className="category-button"
              onClick={() => onSelectCategory(category.strCategory)}
            >
              <img 
                src={category.strCategoryThumb} 
                alt={category.strCategory} 
                className="category-thumbnail" 
              />
              <span>{category.strCategory}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;