import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMoviesStore = defineStore('moviesStore', () => {
  const movies = ref([]);
  const favorites = ref(JSON.parse(localStorage.getItem('favorites') || '[]'));

  const setMovies = (movieList) => {
    movies.value = movieList.map((movie) => ({
      ...movie,
      isFavorite: favorites.value.some((favorite) => favorite.id === movie.id),
    }));
  };

  const toggleFavorite = (movie) => {
    const exists = favorites.value.find((favorite) => favorite.id === movie.id);

    if (exists) {
      favorites.value = favorites.value.filter(
        (favorite) => favorite.id !== movie.id
      );
    } else {
      favorites.value.push(movie);
    }

    localStorage.setItem('favorites', JSON.stringify(favorites.value));

    movies.value = movies.value.map((movie) => ({
      ...movie,
      isFavorite: favorites.value.some((favorite) => favorite.id === movie.id),
    }));
  };

  return { movies, favorites, setMovies, toggleFavorite };
});
