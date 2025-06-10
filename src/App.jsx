import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import MealList from './components/MealList';
import ModalRecipe from './components/ModalRecipe';
import MessageBox from './components/MessageBox';
import LoadingIndicator from './components/LoadingIndicator';
import Footer from './components/Footer';
import CategoryFilter from './components/CategoryFilter';
import AreaFilter from './components/AreaFilter';
import FavoritesView from './components/FavoritesView';
import Pagination from './components/Pagination';

const App = () => {
  const [query, setQuery] = useState('');
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [modalMeal, setModalMeal] = useState(null);
  const [activeView, setActiveView] = useState('random'); // 'random', 'search', 'category', 'area', 'favorites'
  const [activeFilter, setActiveFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchHistory, setSearchHistory] = useState([]);
  
  // Constantes para paginación
  const itemsPerPage = 9;
  const totalPages = Math.ceil(meals.length / itemsPerPage);
  const displayedMeals = meals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1/';
  
  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const fetchMeals = async (endpoint) => {
    setLoading(true);
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
    if (!query.trim()) return showMessage('Por favor, introduce un nombre para buscar.', 'info');
    
    // Guardar en el historial
    addToSearchHistory(query);
    
    const data = await fetchMeals(`search.php?s=${query}`);
    if (data?.meals) {
      setMeals(data.meals);
      setActiveView('search');
      setCurrentPage(1);
    }
    else showMessage(`No se encontraron recetas para "${query}".`, 'info');
  };

  const getMealDetailsById = async (id) => {
    const data = await fetchMeals(`lookup.php?i=${id}`);
    if (data?.meals?.length) setModalMeal(data.meals[0]);
    else showMessage('No se pudieron cargar los detalles de la receta.', 'error');
  };

  const getRandomMeals = async () => {
    setLoading(true);
    setMeals([]);
    setMessage(null);
    try {
      const requests = Array.from({ length: 20 }, () => fetch(`${API_BASE_URL}random.php`).then(res => res.json()));
      const results = await Promise.all(requests);
      const allMeals = results
        .map(r => r.meals && r.meals[0])
        .filter(Boolean);
      const uniqueMeals = Array.from(new Map(allMeals.map(m => [m.idMeal, m])).values());
      setMeals(uniqueMeals);
      setActiveView('random');
      setCurrentPage(1);
      if (!uniqueMeals.length) showMessage('No se encontraron recetas iniciales.', 'info');
    } catch (err) {
      showMessage(`Error al cargar recetas iniciales: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterByCategory = async (category) => {
    setActiveFilter(category);
    const data = await fetchMeals(`filter.php?c=${category}`);
    if (data?.meals) {
      setMeals(data.meals);
      setActiveView('category');
      setCurrentPage(1);
      showMessage(`Mostrando recetas de: ${category}`, 'info');
    } else {
      showMessage(`No se encontraron recetas en la categoría: ${category}`, 'info');
    }
  };

  const filterByArea = async (area) => {
    setActiveFilter(area);
    const data = await fetchMeals(`filter.php?a=${area}`);
    if (data?.meals) {
      setMeals(data.meals);
      setActiveView('area');
      setCurrentPage(1);
      showMessage(`Mostrando recetas de cocina: ${area}`, 'info');
    } else {
      showMessage(`No se encontraron recetas de cocina: ${area}`, 'info');
    }
  };

  const showFavorites = () => {
    setActiveView('favorites');
    setCurrentPage(1);
  };

  const addToSearchHistory = (searchTerm) => {
    // Limitar a las últimas 5 búsquedas y evitar duplicados
    const existingHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const updatedHistory = [
      searchTerm, 
      ...existingHistory.filter(term => term !== searchTerm)
    ].slice(0, 5);
    
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    setSearchHistory(updatedHistory);
  };

  // Cargar el historial de búsquedas al iniciar
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSearchHistory(history);
  }, []);

  useEffect(() => {
    getRandomMeals();
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <div className="app-container">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8">GourmetGrid.com</h1>
        
        <nav className="main-nav">
          <button 
            className={`nav-button ${activeView === 'random' ? 'active' : ''}`}
            onClick={getRandomMeals}
          >
            <i className="fas fa-dice"></i> Aleatorio
          </button>
          
          <button 
            className={`nav-button ${activeView === 'favorites' ? 'active' : ''}`}
            onClick={showFavorites}
          >
            <i className="fas fa-heart"></i> Favoritos
          </button>
        </nav>
        
        <SearchBar 
          query={query} 
          setQuery={setQuery} 
          searchMealByName={searchMealByName} 
          searchHistory={searchHistory}
        />
        
        <div className="filters-container">
          <CategoryFilter 
            onSelectCategory={filterByCategory} 
            API_BASE_URL={API_BASE_URL} 
          />
          
          <AreaFilter 
            onSelectArea={filterByArea} 
            API_BASE_URL={API_BASE_URL} 
          />
        </div>
        
        <MessageBox message={message} />
        <LoadingIndicator loading={loading} />
        
        {activeView === 'favorites' ? (
          <FavoritesView getMealDetailsById={getMealDetailsById} />
        ) : (
          <>
            {activeFilter && (
              <div className="active-filter">
                <h2>
                  {activeView === 'category' ? 'Categoría: ' : 'Cocina: '}
                  <span>{activeFilter}</span>
                </h2>
                <button onClick={() => {
                  setActiveFilter('');
                  getRandomMeals();
                }} className="clear-filter">
                  <i className="fas fa-times"></i> Limpiar filtro
                </button>
              </div>
            )}
            
            <MealList meals={displayedMeals} getMealDetailsById={getMealDetailsById} />
            
            {meals.length > itemsPerPage && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
        
        <ModalRecipe modalMeal={modalMeal} setModalMeal={setModalMeal} />
        <Footer />
      </div>
    </>
  );
};

export default App;