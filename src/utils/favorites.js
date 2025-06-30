export const getFavoritesFromStorage = (username) => {
  const key = `favorites_${username}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

export const saveFavoritesToStorage = (username, favorites) => {
  const key = `favorites_${username}`;
  localStorage.setItem(key, JSON.stringify(favorites));
  console.log('Guardando favoritos para', username, favorites);
};