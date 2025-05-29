import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import MealList from './components/MealList';
import ModalRecipe from './components/ModalRecipe';
import MessageBox from './components/MessageBox';
import LoadingIndicator from './components/LoadingIndicator';
import Footer from './components/Footer';

const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1/';

const App = () => {
  const [query, setQuery] = useState('');
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [modalMeal, setModalMeal] = useState(null);

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const fetchMeals = async (endpoint) => {
    setLoading(true);
    setMeals([]);
    setMessage(null);
    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data;
    } catch (err) {
      showMessage(`Error al cargar: ${err.message}`, 'error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const searchMealByName = async () => {
    if (!query.trim()) {
      showMessage('Por favor, introduce un nombre para buscar.', 'info');
      return;
    }
    const data = await fetchMeals(`search.php?s=${query}`);
    if (data?.meals) {
      setMeals(data.meals);
    } else {
      showMessage(`No se encontraron recetas para "${query}".`, 'info');
    }
  };

  const getRandomMeal = async () => {
    const data = await fetchMeals('random.php');
    if (data?.meals) {
      setMeals(data.meals);
    } else {
      showMessage('No se pudo cargar una receta aleatoria.', 'error');
    }
  };

  const getMealDetailsById = async (id) => {
    const data = await fetchMeals(`lookup.php?i=${id}`);
    if (data?.meals?.length) {
      setModalMeal(data.meals[0]);
    } else {
      showMessage('No se pudieron cargar los detalles de la receta.', 'error');
    }
  };

  useEffect(() => {
    getRandomMeal();
  }, []);

  return (
    <div className="app-container">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-8">GourmetGrid.com</h1>
      <div className="input-group">
        <input
          type="text"
          id="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              searchMealByName();
            }
          }}
          placeholder="Busca una receta por nombre..."
          className="flex-grow"
        />
        <button id="search-btn" onClick={searchMealByName} className="btn">
          <i className="fas fa-search"></i> Buscar Receta
        </button>
        <button id="random-meal-btn" onClick={getRandomMeal} className="btn">
          <i className="fas fa-dice"></i> Receta Aleatoria
        </button>
      </div>

      {message && (
        <div id="message-box" className={`message-box show ${message.type}`}>
          {message.text}
        </div>
      )}

      <div id="loading-indicator" className={`loading-indicator ${loading ? 'show' : 'hidden'}`}>
        <i className="fas fa-spinner fa-spin mr-2"></i> Cargando recetas...
      </div>

      <div id="meal-results" className="meal-results">
        {meals.map((meal) => (
          <div key={meal.idMeal} className="meal-card">
            <img src={meal.strMealThumb} alt={meal.strMeal} />
            <div className="meal-card-content">
              <h3>{meal.strMeal}</h3>
              <button
                className="btn btn-view-recipe"
                onClick={() => getMealDetailsById(meal.idMeal)}
              >
                Ver Receta <i className="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalMeal && (
        <div id="recipe-modal-overlay" className="modal-overlay show" onClick={(e) => {
          if (e.target.id === 'recipe-modal-overlay') {
            setModalMeal(null);
          }
        }}>
          <div className="modal-content">
            <button
              id="modal-close-btn"
              onClick={() => setModalMeal(null)}
              className="modal-close-btn"
            >&times;</button>
            <h2 id="modal-meal-name">{modalMeal.strMeal}</h2>
            <img
              id="modal-meal-image"
              src={modalMeal.strMealThumb}
              alt="Imagen de la receta"
            />
            <p className="text-gray-400 text-center mb-4">
              <span id="modal-meal-category">{modalMeal.strCategory || 'N/A'}</span> |{' '}
              <span id="modal-meal-area">{modalMeal.strArea || 'N/A'}</span>
            </p>
            <h3>Ingredientes</h3>
            <ul id="modal-ingredients-list">
              {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => {
                const ing = modalMeal[`strIngredient${n}`];
                const msr = modalMeal[`strMeasure${n}`];
                return ing && ing.trim() ? <li key={n}>{`${msr ? msr.trim() : ''} ${ing.trim()}`}</li> : null;
              })}
            </ul>
            <h3>Instrucciones</h3>
            <p id="modal-instructions">{modalMeal.strInstructions}</p>
            {modalMeal.strYoutube && (
              <>
                <h3 id="modal-youtube-title">Video de YouTube</h3>
                <a
                  id="modal-youtube-link"
                  href={modalMeal.strYoutube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center mt-4"
                >
                  Ver video en YouTube <i className="fab fa-youtube ml-2"></i>
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;