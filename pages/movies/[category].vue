<template>
    <Header :isVisible="isInputVisible" @toggleInput="toggleInput" />
    <GlobalSearch :isVisible="isInputVisible" />

    <div class=" bg-gray-900 h-16"></div>

    <div class="container px-12 py-4 flex flex-col gap-4">
        <!-- filters section -->
        <div class="bg-neutral-200/50 rounded-lg p-4 min-w-56 flex flex-wrap items-center gap-4">
            <!-- Sort dropdown -->
            <div class="flex flex-col gap-2">
                <label class="text-sm font-medium">Sort by:</label>
                <select v-model="sortBy" class="rounded-md px-2 py-1 text-sm h-10 w-60 bg-white">
                    <option value="" disabled>Select sorting</option>
                    <option value="vote_average_asc">Rating Ascending</option>
                    <option value="vote_average_desc">Rating Descending</option>
                    <option value="release_date_asc">Release Date Ascending</option>
                    <option value="release_date_desc">Release Date Descending</option>
                </select>
            </div>

            <!-- Genre badges -->
            <div class="flex flex-wrap gap-2">
                <button
                    v-for="genre in genresArr"
                    :key="genre.id"
                    @click="toggleGenre(genre.id)"
                    :class="[
                        'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                        selectedGenres.includes(genre.id)
                            ? 'bg-black text-white'
                            : 'bg-white hover:bg-gray-100'
                    ]"
                >
                    {{ genre.name }}
                </button>
            </div>

            <!-- keyword filter -->
            <div class="flex flex-col w-full gap-2 text-sm font-medium">
                <span>Filter by word</span>
                <input v-model="filteredKeyword" class="flex items-center w-60 rounded-lg h-10 px-4 placeholder:italic placeholder:text-sm" placeholder="Batman"/>
            </div>

            <!-- Date range filter -->
            <div class="flex flex-col gap-2 w-full">
                <span class="text-sm font-medium">Release date range:</span>
                <div class="flex gap-4">
                    <div class="flex flex-col gap-1">
                        <label class="text-xs">From:</label>
                        <input 
                            type="date" 
                            v-model="dateRange.from"
                            :min="minDate"
                            :max="maxDate"
                            class="rounded-md px-2 py-1 text-sm h-10 w-60 bg-white"
                        />
                    </div>
                    <div class="flex flex-col gap-1">
                        <label class="text-xs">To:</label>
                        <input 
                            type="date" 
                            v-model="dateRange.to"
                            :min="minDate"
                            :max="maxDate"
                            class="rounded-md px-2 py-1 text-sm h-10 w-60 bg-white"
                        />
                    </div>
                </div>
            </div>

            <!-- Rating range filter -->
            <div class="flex flex-col gap-2 w-full">
                <span class="text-sm font-medium">Minimum rating: {{ ratingRange }}⭐</span>
                <input 
                    type="range" 
                    v-model="ratingRange" 
                    min="0" 
                    max="10" 
                    step="0.5"
                    class="w-60"
                />
            </div>

            <!-- Search and Clear buttons -->
            <div class="flex w-full items-center gap-4">
                <button
                    v-if="hasActiveFilters"
                    @click="handleSearch"
                    class="relative flex h-10 w-60 items-center justify-center rounded-lg bg-gradient-to-r from-zinc-950 to-zinc-900 px-4 text-sm font-normal text-slate-200 shadow before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,theme(colors.white/.5)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:[transition:background-position_0s_ease] hover:before:bg-[position:-100%_0,0_0] hover:before:duration-[1500ms] focus:outline-none focus:ring focus:ring-slate-500/50 focus-visible:outline-none focus-visible:ring focus-visible:ring-slate-500/50"
                >
                    Search
                </button>
                <button
                    v-if="hasActiveFilters"
                    @click="clearFilters"
                    class="flex h-10 w-60 items-center justify-center rounded-lg px-4 underline text-sm font-normal text-zinc-700 hover:bg-zinc-50"
                >
                    Clear Filters
                </button>
            </div>
        </div>

        <!-- results section -->
        <div>
            <div v-if="isMoviesLoading" class="flex gap-2 pb-4 pt-6">
                <MovieCardSkeleton v-for="n in 4" :key="n" />
            </div>
            <ul
                v-else-if="movies.length > 0"
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
            
            <div v-else class="p-4 w-full text-center">
                No result.
            </div>
        </div>
    </div>
</template>

<script setup>
import MovieCardSkeleton from '../../components/MoviesSlider/MovieCardSkeleton.vue';
import MovieCard from '../../components/MoviesSlider/MovieCard.vue';

const isInputVisible = ref(false);
const movies = ref([]);
const isMoviesLoading = ref(true);
const movieKeyword = ref({ type: 'movie', defaultKey: 'popular' });
const selectedGenres = ref([]);
const genresArr = ref([]);
const sortBy = ref('');
const allMovies = ref([]);
const filteredKeyword = ref('');
const dateRange = ref({
    from: '',
    to: ''
});
const ratingRange = ref(0);

const minDate = computed(() => {
    if (!allMovies.value.length) return '';
    return allMovies.value.reduce((min, movie) => {
        return movie.release_date < min ? movie.release_date : min;
    }, allMovies.value[0].release_date);
});

const maxDate = computed(() => {
    if (!allMovies.value.length) return '';
    return allMovies.value.reduce((max, movie) => {
        return movie.release_date > max ? movie.release_date : max;
    }, allMovies.value[0].release_date);
});

const filteredMovies = computed(() => {
    let result = [...allMovies.value];
    
    if (selectedGenres.value.length > 0) {
        result = result.filter(movie => 
            selectedGenres.value.every(genreId => movie?.genre_ids.includes(genreId))
        );
    }

    switch (sortBy.value) {
        case 'vote_average_asc':
            result.sort((a, b) => a.vote_average - b.vote_average);
            break;
        case 'vote_average_desc':
            result.sort((a, b) => b.vote_average - a.vote_average);
            break;
        case 'release_date_asc':
            result.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
            break;
        case 'release_date_desc':
            result.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
            break;
    }

    if (filteredKeyword.value.length > 0) {
        result = result.filter(movie => 
            normalizeString(movie?.title).includes(normalizeString(filteredKeyword.value))
        );
    }

    if (dateRange.value.from) {
        result = result.filter(movie => 
            movie.release_date >= dateRange.value.from
        );
    }
    if (dateRange.value.to) {
        result = result.filter(movie => 
            movie.release_date <= dateRange.value.to
        );
    }

    if (ratingRange.value > 0) {
        result = result.filter(movie => 
            movie.vote_average >= ratingRange.value
        );
    }
    
    return result;
});

const categoryEndpoints = {
  'popular': 'popular',
  'now-playing': 'now_playing',
  'top-rated': 'top_rated',
  'upcoming': 'upcoming'
};

const route = useRoute();
const router = useRouter();

const currentEndpoint = computed(() => {
  const category = route.params.category;
  return categoryEndpoints[category] || 'popular';
});

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_READ_ACCESS_TOKEN}`,
    },
};

const fetchMovies = async () => {
  isMoviesLoading.value = true;
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${currentEndpoint.value}?language=en-US&page=1`,
      options,
    );
    const { results } = await response.json();
    allMovies.value = results;
    movies.value = results;
    
    const maxReleaseDate = results.reduce((max, movie) => {
        return movie.release_date > max ? movie.release_date : max;
    }, results[0].release_date);
    dateRange.value.to = maxReleaseDate;
    
  } catch (error) {
    console.error(error);
  } finally {
    isMoviesLoading.value = false;
  }
};

const fetchGenres = async () => {
    try {
        const response = await fetch (
            'https://api.themoviedb.org/3/genre/movie/list?language=en',
            options
        );
        const { genres } = await response.json();
        genresArr.value = genres;
    } catch (error) {
        console.error(error)
    }
};

const handleFavorite = (movieObj, type) => {
    const list = type === 'movie' ? movies : series;
    const index = list.value.findIndex(item => item.id === movieObj.id);
    if (index !== -1) {
        list.value[index].isFavorite = !list.value[index].isFavorite;
    }
};

const handleSearch = () => {
    movies.value = filteredMovies.value;
};

const toggleInput = () => {
    isInputVisible.value = !isInputVisible.value;
};

const toggleGenre = (id) => {
    if (selectedGenres.value.includes(id)) {
        const index = selectedGenres.value.findIndex(value => value === id);
        selectedGenres.value.splice(index, 1);
    } else {
        selectedGenres.value.push(id);
    }
}

watchEffect(() => {
  if (route.params.category) {
    fetchMovies();
  }
  fetchGenres();
});

onMounted(() => {
  if (route.path === '/movies/' || route.path === '/movies') {
    router.push('/movies/popular');
  }
});

const normalizeString = (str) => {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^a-z0-9\s]/g, '')     // Remove special characters
        .replace(/\s+/g, '')             // Remove spaces
        .trim();
};

// Add computed property to check if any filters are active
const hasActiveFilters = computed(() => {
    return selectedGenres.value.length > 0 || 
           sortBy.value !== '' || 
           filteredKeyword.value !== '' ||
           dateRange.value.from !== '' ||
           ratingRange.value > 0;
});

// Add clearFilters function
const clearFilters = () => {
    selectedGenres.value = [];
    sortBy.value = '';
    filteredKeyword.value = '';
    dateRange.value = {
        from: '',
        to: maxDate.value
    };
    ratingRange.value = 0;
    movies.value = allMovies.value;
};
</script>