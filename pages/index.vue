<template>
    <Header :isVisible="isInputVisible" @toggleInput="toggleInput" />
    <GlobalSearch :isVisible="isInputVisible" />
    <HeroSection />
    <MoviesSlider
        title="Movies"
        :isMoviesLoading="isMoviesLoading"
        :movies="movies"
        :movieKeyword="movieKeyword"
        @keyword-changed="updateMovieKeyword"
        @handle-favorite="handleFavorite"
    />
    <MoviesSlider
        title="Tv Shows"
        :isMoviesLoading="isSeriesLoading"
        :movies="series"
        :movieKeyword="seriesKeyword"
        @keyword-changed="updateSeriesKeyword"
        @handle-favorite="handleFavorite"
    />
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import Header from './components/Header/Header.vue';
import GlobalSearch from './components/GlobalSearch/GlobalSearch.vue';
import HeroSection from './components/HeroSection/HeroSection.vue';
import MoviesSlider from './components/MoviesSlider/MoviesSlider.vue';

const isInputVisible = ref(false);
const isMoviesLoading = ref(true);
const isSeriesLoading = ref(true);
const movies = ref([]);
const series = ref([]);
const movieKeyword = ref({ type: 'movie', defaultKey: 'popular' });
const seriesKeyword = ref({ type: 'series', defaultKey: 'popular' });

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_READ_ACCESS_TOKEN}`,
    },
};

const fetchMovies = async () => {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movieKeyword.value.defaultKey}?language=en-US&page=1`,
            options,
        );
        const { results } = await response.json();
        movies.value = results;
    } catch (error) {
        console.error(error);
    } finally {
        isMoviesLoading.value = false;
    }
};

const fetchTVSeries = async () => {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/tv/${seriesKeyword.value.defaultKey}?language=en-US&page=1`,
            options,
        );
        const { results } = await response.json();
        series.value = results;
    } catch (error) {
        console.error(error);
    } finally {
        isSeriesLoading.value = false;
    }
};

const handleFavorite = (movieObj, type) => {
    const list = type === 'movie' ? movies : series;
    const index = list.value.findIndex(item => item.id === movieObj.id);
    if (index !== -1) {
        list.value[index].isFavorite = !list.value[index].isFavorite;
    }
};

const updateMovieKeyword = (keyword) => {
    movieKeyword.value.defaultKey = keyword.replace(' ', '_');
    fetchMovies();
};

const updateSeriesKeyword = (keyword) => {
    seriesKeyword.value.defaultKey = keyword.replace(' ', '_');
    fetchTVSeries();
};

const toggleInput = () => {
    isInputVisible.value = !isInputVisible.value;
};

const handleScroll = () => {
    if (isInputVisible.value === true) {
        isInputVisible.value = false;
    }
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
    fetchMovies();
    fetchTVSeries();
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});

watch(
    [movieKeyword, seriesKeyword],
    () => {
        fetchMovies();
        fetchTVSeries();
    },
    { deep: true },
);
</script>
