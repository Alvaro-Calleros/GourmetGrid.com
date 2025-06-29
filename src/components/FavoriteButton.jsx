import React, { useState, useEffect } from 'react';
import { getFavoritesFromStorage, saveFavoritesToStorage } from '../utils/favorites';

const FavoriteButton = ({ meal, username }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = getFavoritesFromStorage(username);
    const isAlreadyFavorite = favorites.some(fav => fav.idMeal === meal.idMeal);
    setIsFavorite(isAlreadyFavorite);
  }, [meal.idMeal, username]);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    const favorites = getFavoritesFromStorage(username);

    let updatedFavorites;
    if (isFavorite) {
      updatedFavorites = favorites.filter(fav => fav.idMeal !== meal.idMeal);
    } else {
      const mealToSave = {
        idMeal: meal.idMeal,
        strMeal: meal.strMeal,
        strMealThumb: meal.strMealThumb
      };
      updatedFavorites = [...favorites, mealToSave];
    }

    saveFavoritesToStorage(username, updatedFavorites);
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