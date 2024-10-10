<template>
    <Header :isVisible="isInputVisible" @toggleInput="toggleInput" />
    <GlobalSearch :isVisible="isInputVisible" />
    <HeroSection />
    <MoviesSlider
        title="Movies"
        :isMoviesLoading="isMoviesLoading"
        :movies="moviesStore.movies"
        :movieKeyword="movieKeyword"
        @keyword-changed="updateMovieKeyword"
        @handle-favorite="handleFavorite"
    />
    <MoviesSlider
        title="Tv Shows"
        :isMoviesLoading="isMoviesLoading"
        :movies="seriesStore.seriesData"
        :movieKeyword="seriesKeyword"
        @keyword-changed="updateMovieKeyword"
        @handle-favorite="handleFavorite"
    />
</template>

<script setup>
import { useMoviesStore } from './stores/useMoviesStore';
import { useTvSeriesStore } from './stores/useTvSeriesStore';
import { ref, watch, onMounted, onUnmounted } from 'vue';
import Header from './components/Header/Header.vue';
import GlobalSearch from './components/GlobalSearch/GlobalSearch.vue';
import HeroSection from './components/HeroSection/HeroSection.vue';
import MoviesSlider from './components/MoviesSlider/MoviesSlider.vue';

const moviesStore = useMoviesStore();
const seriesStore = useTvSeriesStore();
const isInputVisible = ref(false);
const isMoviesLoading = ref(true);
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

        moviesStore.setMovies(results);
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

        seriesStore.setSeries(results);
    } catch (error) {
        console.error(error);
    } finally {
        isMoviesLoading.value = false;
    }
};

const handleFavorite = (movieObj, type) => {
    if (type === 'movie') {
        moviesStore.toggleFavorite(movieObj);
    } else if (type === 'series') {
        seriesStore.toggleFavorite(movieObj);
    }
};

const updateMovieKeyword = (keyword, type) => {
    if (type === 'movie') {
        movieKeyword.value.defaultKey = keyword.replace(' ', '_');
        fetchMovies();
    } else if (type === 'series') {
        seriesKeyword.value.defaultKey = keyword.replace(' ', '_');
        fetchTVSeries();
    }
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
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});

watch(
    movieKeyword,
    () => {
        fetchMovies();
        fetchTVSeries();
    },
    { immediate: true },
);
</script>
