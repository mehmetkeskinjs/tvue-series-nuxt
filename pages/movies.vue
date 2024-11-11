<template>
    <Header :isVisible="isInputVisible" @toggleInput="toggleInput" />
    <GlobalSearch :isVisible="isInputVisible" />

    <div class=" bg-gray-900 h-16"></div>

    <div class="container px-12 py-4 flex flex-col gap-4">
        <!-- filters section -->
        <div class="bg-neutral-200/50 rounded-lg p-4 min-w-56 flex flex-wrap items-center gap-4">
            <!-- Sort dropdown -->
            <div class="flex items-center gap-2">
                <label class="text-sm font-medium">Sort by:</label>
                <select v-model="sortBy" class="rounded-md px-2 py-1 text-sm bg-white">
                    <option value="popularity">Popularity</option>
                    <option value="release_date">Release Date</option>
                    <option value="vote_average">Rating</option>
                    <option value="title">Title</option>
                </select>
            </div>

            <!-- Price range -->
            <div class="flex items-center gap-2">
                <label class="text-sm font-medium">Price:</label>
                <div class="flex gap-2">
                    <input 
                        v-model="priceRange.min" 
                        type="number" 
                        placeholder="Min" 
                        class="w-20 rounded-md px-2 py-1 text-sm"
                    >
                    <span>-</span>
                    <input 
                        v-model="priceRange.max" 
                        type="number" 
                        placeholder="Max" 
                        class="w-20 rounded-md px-2 py-1 text-sm"
                    >
                </div>
            </div>

            <!-- Genre badges -->
            <div class="flex flex-wrap gap-2">
                <button
                    v-for="genre in genres"
                    :key="genre.id"
                    @click="toggleGenre(genre.id)"
                    :class="[
                        'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                        selectedGenres.includes(genre.id)
                            ? 'bg-blue-500 text-white'
                            : 'bg-white hover:bg-gray-100'
                    ]"
                >
                    {{ genre.name }}
                </button>
            </div>
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

const sortBy = ref('popularity');
const priceRange = ref({ min: null, max: null });
const selectedGenres = ref([]);
const genres = ref([
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    // Add more genres as needed
]);

const currentEndpoint = ref('now_playing');

const toggleGenre = (genreId) => {
    const index = selectedGenres.value.indexOf(genreId);
    if (index === -1) {
        selectedGenres.value.push(genreId);
    } else {
        selectedGenres.value.splice(index, 1);
    }
};

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
            `https://api.themoviedb.org/3/movie/${currentEndpoint.value}?language=en-US&page=1`,
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

const route = useRoute();
watch(
    () => route.params.category,
    (newCategory) => {
        if (newCategory) {
            currentEndpoint.value = newCategory;
            fetchMovies();
        }
    },
    { immediate: true }
);

onMounted(() => {
    fetchMovies();
});
</script>