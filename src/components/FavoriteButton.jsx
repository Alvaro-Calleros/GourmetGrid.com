import React, { useState, useEffect } from 'react';

const FavoriteButton = ({ meal }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Comprobar si esta receta ya está en favoritos
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const isAlreadyFavorite = favorites.some(fav => fav.idMeal === meal.idMeal);
    setIsFavorite(isAlreadyFavorite);
  }, [meal.idMeal]);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (isFavorite) {
      // Eliminar de favoritos
      const newFavorites = favorites.filter(fav => fav.idMeal !== meal.idMeal);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    } else {
      // Añadir a favoritos
      const mealToSave = {
        idMeal: meal.idMeal,
        strMeal: meal.strMeal,
        strMealThumb: meal.strMealThumb
      };
      localStorage.setItem('favorites', JSON.stringify([...favorites, mealToSave]));
    }
    
    setIsFavorite(!isFavorite);
  };

  return (
    <button 
      className={`favorite-button ${isFavorite ? 'is-favorite' : ''}`}
      onClick={toggleFavorite}
      aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
    >
      <i className={`fas ${isFavorite ? 'fa-heart' : 'fa-heart-o'}`}></i>
    </button>
  );
};

export default FavoriteButton;