import React, { useState, useEffect } from 'react';

const ModalRecipe = ({ modalMeal, setModalMeal }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (modalMeal) {
      // Comprobar si esta receta ya está en favoritos
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      const isAlreadyFavorite = favorites.some(fav => fav.idMeal === modalMeal.idMeal);
      setIsFavorite(isAlreadyFavorite);
    }
  }, [modalMeal]);

  if (!modalMeal) return null;

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (isFavorite) {
      // Eliminar de favoritos
      const newFavorites = favorites.filter(fav => fav.idMeal !== modalMeal.idMeal);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    } else {
      // Añadir a favoritos
      const mealToSave = {
        idMeal: modalMeal.idMeal,
        strMeal: modalMeal.strMeal,
        strMealThumb: modalMeal.strMealThumb
      };
      localStorage.setItem('favorites', JSON.stringify([...favorites, mealToSave]));
    }
    
    setIsFavorite(!isFavorite);
  };

  const ingredients = Array.from({ length: 20 }, (_, i) => {
    const ing = modalMeal[`strIngredient${i+1}`];
    const msr = modalMeal[`strMeasure${i+1}`];
    return ing && ing.trim() ? `${msr} ${ing}` : null;
  }).filter(Boolean);

  const steps = modalMeal.strInstructions
    ? modalMeal.strInstructions
        .split(/\r?\n|\.\s+(?=[A-Z])/)
        .map(s => s.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="modal-overlay show" onClick={() => setModalMeal(null)}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="modal-close-btn"
          onClick={() => setModalMeal(null)}
        >
          &times;
        </button>

        <button 
          className={`modal-favorite-button ${isFavorite ? 'is-favorite' : ''}`}
          onClick={toggleFavorite}
          aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
        >
          <i className={`fas ${isFavorite ? 'fa-heart' : 'fa-heart-o'}`}></i>
          <span style={{ marginLeft: '0.5rem', fontWeight: 600, color: 'white', fontSize: '1rem' }}>
            {isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          </span>
        </button>

        <h2 className="modal-title">{modalMeal.strMeal}</h2>

        <img
          className="modal-image"
          src={modalMeal.strMealThumb}
          alt={modalMeal.strMeal}
        />

        <p className="modal-meta">
          <span className="modal-category">{modalMeal.strCategory}</span> |{' '}
          <span className="modal-area">{modalMeal.strArea}</span>
        </p>

        <h3>Ingredientes</h3>
        <ul className="modal-ingredients-list">
          {ingredients.map((line, idx) => (
            <li key={idx}>{line}</li>
          ))}
        </ul>

        <h3>Instrucciones</h3>
        <ol className="modal-instructions">
          {steps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>

        {modalMeal.strYoutube && (
          <>
            <h3 className="modal-youtube-title">Video de YouTube</h3>
            <a
              className="modal-youtube-link"
              href={modalMeal.strYoutube}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver video en YouTube <i className="fab fa-youtube ml-1"></i>
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default ModalRecipe;