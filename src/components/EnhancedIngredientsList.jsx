import React from 'react';

const EnhancedIngredientsList = ({ ingredients, measures }) => {
  // Filtrar ingredientes vacíos
  const validIngredients = ingredients
    .map((ing, i) => ({
      name: ing,
      measure: measures[i] || ''
    }))
    .filter(item => item.name && item.name.trim() !== '');

  return (
    <div className="ingredients-grid">
      {validIngredients.map((item, idx) => (
        <div key={idx} className="ingredient-item">
          <img 
            src={`https://www.themealdb.com/images/ingredients/${encodeURIComponent(item.name)}-small.png`}
            alt={item.name}
            className="ingredient-thumbnail"
          />
          <div className="ingredient-details">
            <span className="ingredient-name">{item.name}</span>
            <span className="ingredient-measure">{item.measure}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EnhancedIngredientsList;