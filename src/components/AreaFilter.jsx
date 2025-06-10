import React, { useState, useEffect } from 'react';

const AreaFilter = ({ onSelectArea, API_BASE_URL }) => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAreas = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}list.php?a=list`);
        const data = await response.json();
        if (data.meals) {
          setAreas(data.meals);
        }
      } catch (error) {
        console.error('Error cargando áreas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAreas();
  }, [API_BASE_URL]);

  return (
    <div className="area-filter">
      <h3 className="filter-title">Cocinas del Mundo</h3>
      {loading ? (
        <p>Cargando regiones...</p>
      ) : (
        <div className="area-buttons">
          {areas.map((area) => (
            <button
              key={area.strArea}
              className="area-button"
              onClick={() => onSelectArea(area.strArea)}
            >
              {area.strArea}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AreaFilter;