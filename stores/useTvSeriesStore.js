import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTvSeriesStore = defineStore('seriesStore', () => {
  const seriesData = ref([]);
  const favoriteSeries = ref(
    JSON.parse(localStorage.getItem('favorite-series') || '[]')
  );

  const setSeries = (seriesList) => {
    seriesData.value = seriesList.map((series) => ({
      ...series,
      isFavorite: favoriteSeries.value.some(
        (favorite) => favorite.id === series.id
      ),
    }));
  };

  const toggleFavorite = (series) => {
    const exists = favoriteSeries.value.find(
      (favorite) => favorite.id === series.id
    );

    if (exists) {
      favoriteSeries.value = favoriteSeries.value.filter(
        (favorite) => favorite.id !== series.id
      );
    } else {
      favoriteSeries.value.push(series);
    }

    localStorage.setItem(
      'favorite-series',
      JSON.stringify(favoriteSeries.value)
    );

    seriesData.value = seriesData.value.map((series) => ({
      ...series,
      isFavorite: favoriteSeries.value.some(
        (favorite) => favorite.id === series.id
      ),
    }));
  };

  return { seriesData, favoriteSeries, setSeries, toggleFavorite };
});
