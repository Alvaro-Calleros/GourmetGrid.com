import React, { useState, useRef, useEffect } from 'react';

export default function SearchBar({
  query,
  setQuery,
  searchMealByName,
  searchHistory = []
}) {
  const [showHistory, setShowHistory] = useState(false);
  const inputRef = useRef(null);
  const historyRef = useRef(null);

  // Cerrar el historial cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        historyRef.current && 
        !historyRef.current.contains(event.target) && 
        inputRef.current && 
        !inputRef.current.contains(event.target)
      ) {
        setShowHistory(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputFocus = () => {
    if (searchHistory.length > 0) {
      setShowHistory(true);
    }
  };

  const handleHistoryItemClick = (term) => {
    setQuery(term);
    setShowHistory(false);
    // Opcional: buscar automáticamente
    setTimeout(() => searchMealByName(), 100);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      searchMealByName();
    }
  };

  return (
    <div className="input-group" style={{ position: 'relative' }}>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
        placeholder="Busca una receta por nombre..."
        className="flex-grow"
      />
      <button onClick={searchMealByName} className="btn">
        <i className="fas fa-search"></i> Buscar
      </button>
      
      {showHistory && searchHistory.length > 0 && (
        <div className="search-history" ref={historyRef}>
          {searchHistory.map((term, index) => (
            <div 
              key={index} 
              className="history-item"
              onClick={() => handleHistoryItemClick(term)}
            >
              <i className="fas fa-history"></i>
              {term}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}