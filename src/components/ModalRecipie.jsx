import React from 'react';

const ModalRecipe = ({ modalMeal, setModalMeal }) => {
  if (!modalMeal) return null;

  return (
    <div className="modal-overlay show">
      <div className="modal-content">
        <button onClick={() => setModalMeal(null)} className="modal-close-btn">
          &times;
        </button>
        <h2>{modalMeal.strMeal}</h2>
        <img src={modalMeal.strMealThumb} alt={modalMeal.strMeal} />
        {/* Add more modal content here */}
      </div>
    </div>
  );
};

export default ModalRecipe;