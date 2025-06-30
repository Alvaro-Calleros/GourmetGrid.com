import React, { useState, useEffect } from 'react';
import MealCard from './MealCard';
import { getFavoritesFromStorage, saveFavoritesToStorage } from '../utils/favorites';

const FavoritesView = ({ getMealDetailsById, username }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setFavorites(getFavoritesFromStorage(username));
  }, [username]);

  const removeFavorite = (idMeal) => {
    const updatedFavorites = favorites.filter(fav => fav.idMeal !== idMeal);
    saveFavoritesToStorage(username, updatedFavorites);
    setFavorites(updatedFavorites);
  };

  if (favorites.length === 0) {
    return (
      <div className="favorites-empty">
        <i className="fas fa-heart-broken"></i>
        <p>Aún no tienes recetas favoritas guardadas.</p>
        <p>Añade recetas a favoritos para encontrarlas aquí.</p>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <h2 className="favorites-title">
        <i className="fas fa-heart"></i> Mis Recetas Favoritas
      </h2>
      <div className="meal-results">
        {favorites.map((meal) => (
          <div key={meal.idMeal} className="favorite-meal-container">
            <MealCard meal={meal} onShowDetails={getMealDetailsById} username={username}/>
            <button 
              className="remove-favorite-button"
              onClick={() => removeFavorite(meal.idMeal)}
            >
              <i className="fas fa-trash"></i> Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesView;