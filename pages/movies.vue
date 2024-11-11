<template>
    <Header :isVisible="isInputVisible" @toggleInput="toggleInput" />
    <GlobalSearch :isVisible="isInputVisible" />

    <div class=" bg-gray-900 h-16"></div>

    <div class="container px-12 py-8 flex flex-col gap-4">
        <!-- filters section -->
        <div class="bg-black h-56 min-w-56">

        </div>

        <!-- results section -->
        <div>
            <div v-if="isMoviesLoading" class="flex gap-2 pb-4 pt-6">
                <MovieCardSkeleton v-for="n in 4" :key="n" />
            </div>
            <ul
                v-else
                ref="sliderContainer"
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-4"
            >
                <MovieCard  
                    v-for="movie in movies"
                    :key="movie.id"
                    :movie="movie"
                    :data-id="movie.id"
                    @handle-favorite="handleFavorite"
                    :movieKeyword="movieKeyword"
                />
            </ul>
        </div>
    </div>
</template>

<script setup>
import MovieCardSkeleton from '../components/MoviesSlider/MovieCardSkeleton.vue';
import MovieCard from '../components/MoviesSlider/MovieCard.vue';

const isInputVisible = ref(false);
const movies = ref([]);
const isMoviesLoading = ref(true);
const movieKeyword = ref({ type: 'movie', defaultKey: 'popular' });

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
            `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1`,
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

const handleFavorite = (movieObj, type) => {
    const list = type === 'movie' ? movies : series;
    const index = list.value.findIndex(item => item.id === movieObj.id);
    if (index !== -1) {
        list.value[index].isFavorite = !list.value[index].isFavorite;
    }
};

const toggleInput = () => {
    isInputVisible.value = !isInputVisible.value;
};

onMounted(() => {
    fetchMovies();
});
</script>