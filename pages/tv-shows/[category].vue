<template>
    <Header :isVisible="isInputVisible" @toggleInput="toggleInput" :isHeaderFull="isHeaderFull" />
    <GlobalSearch :isVisible="isInputVisible" />

    <div class=" bg-gray-900 h-16"></div>

    <div class="px-12 py-4 flex gap-4 justify-center">
        <!-- filters section -->
        <div class="bg-neutral-200/50 sticky h-fit top-4 left-0 rounded-lg p-4 max-w-72 flex flex-col items-center gap-4">
            <!-- Sort dropdown -->
            <div class="flex flex-col gap-2 w-full">
                <label class="text-sm font-medium">Sort by</label>
                <select v-model="sortBy" class="rounded-md px-2 py-1 text-sm h-10 w-full bg-white">
                    <option value="" disabled>Select sorting</option>
                    <option value="vote_average_asc">Rating Ascending</option>
                    <option value="vote_average_desc">Rating Descending</option>
                    <option value="release_date_asc">Release Date Ascending</option>
                    <option value="release_date_desc">Release Date Descending</option>
                </select>
            </div>

            <!-- Genre badges -->
            <div class="flex flex-col gap-2 w-full">
                <span class="text-sm font-medium">Genres</span>
                <div class="flex flex-wrap gap-2">
                    <button
                        v-for="genre in genresArr"
                        :key="genre.id"
                        @click="toggleGenre(genre.id)"
                        :class="[
                            'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                            selectedGenres.includes(genre.id)
                                ? 'bg-neutral-900 text-white'
                                : 'bg-white hover:bg-gray-100'
                        ]"
                    >
                        {{ genre.name }}
                    </button>
                </div>
            </div>

            <!-- keyword filter -->
            <div class="flex flex-col w-full gap-2 text-sm font-medium">
                <span>Filter by word</span>
                <input v-model="filteredTvShowKeyword" class="flex outline-neutral-900 items-center w-full rounded-lg h-10 px-4 placeholder:italic placeholder:text-sm" placeholder="Batman"/>
            </div>

            <!-- Date range filter -->
            <div class="flex flex-col gap-2 w-full">
                <span class="text-sm font-medium">Release date range</span>
                <div class="flex gap-4 flex-col">
                    <div class="flex flex-col gap-1">
                        <label class="text-xs">From:</label>
                        <input 
                            type="date" 
                            v-model="dateRange.from"
                            :min="minDate"
                            :max="maxDate"
                            class="rounded-md px-2 py-1 text-sm h-10 w-full bg-white"
                        />
                    </div>
                    <div class="flex flex-col gap-1">
                        <label class="text-xs">To:</label>
                        <input 
                            type="date" 
                            v-model="dateRange.to"
                            :min="minDate"
                            :max="maxDate"
                            class="rounded-md px-2 py-1 text-sm h-10 w-full bg-white"
                        />
                    </div>
                </div>
            </div>

            <!-- Rating range filter -->
            <div class="flex flex-col gap-2 w-full">
                <span class="text-sm font-medium">Rating range: {{ ratingRange.min }} - {{ ratingRange.max }}</span>
                <div class="flex flex-col gap-3">
                    <input 
                        type="range"
                        v-model="ratingRange.min" 
                        min="0" 
                        max="10" 
                        step="0.5"
                        class="accent-zinc-900"
                        @input="updateMax"
                    />
                    <input 
                        type="range" 
                        v-model="ratingRange.max" 
                        min="0" 
                        max="10" 
                        step="0.5"
                        class="accent-zinc-900"
                        @input="updateMin"
                    />
                </div>
            </div>

            <!-- Search and Clear buttons -->
            <div class="flex w-full items-center gap-4">
                <button
                    v-if="hasActiveFilters"
                    @click="handleSearch"
                    class="relative flex h-10 w-full items-center justify-center rounded-lg bg-gradient-to-r from-zinc-950 to-zinc-900 px-4 text-sm font-normal text-slate-200 shadow before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,theme(colors.white/.5)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:[transition:background-position_0s_ease] hover:before:bg-[position:-100%_0,0_0] hover:before:duration-[1500ms] focus:outline-none focus:ring focus:ring-slate-500/50 focus-visible:outline-none focus-visible:ring focus-visible:ring-slate-500/50"
                >
                    Search
                </button>
                <button
                    v-if="hasActiveFilters"
                    @click="clearFilters"
                    class="flex h-10 w-full items-center justify-center rounded-lg px-4 underline text-sm font-normal text-zinc-700 hover:bg-zinc-50"
                >
                    Clear Filters
                </button>
            </div>
        </div>

        <!-- results section -->
        <div class="w-full">
            <div v-if="isTvShowsLoading" class="flex gap-2 pb-4 pt-6">
                <MovieCardSkeleton v-for="n in 4" :key="n" />
            </div>
            <ul
                v-else-if="tvShows.length > 0"
                ref="sliderContainer"
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 pb-4"
            >
                <MovieCard
                    v-for="tvShow in tvShows"
                    :key="tvShow.id"
                    :movie="tvShow"
                    :data-id="tvShow.id"
                    @handle-favorite="handleFavorite"
                    :movieKeyword="tvShowKeyword"
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

const isHeaderFull = ref(true)
const isInputVisible = ref(false);
const tvShows = ref([]);
const isTvShowsLoading = ref(true);
const tvShowKeyword = ref({ type: 'tv', defaultKey: 'popular' });
const selectedGenres = ref([]);
const genresArr = ref([]);
const sortBy = ref('');
const allTvShows = ref([]);
const filteredTvShowKeyword = ref('');
const dateRange = ref({
    from: '',
    to: ''
});
const ratingRange = ref({
    min: 0,
    max: 10
});

const minDate = computed(() => {
    if (!allTvShows.value.length) return '';
    return allTvShows.value.reduce((min, tvShow) => {
        return tvShow.first_air_date < min ? tvShow.first_air_date : min;
    }, allTvShows.value[0].first_air_date);
});

const maxDate = computed(() => {
    if (!allTvShows.value.length) return '';
    return allTvShows.value.reduce((max, tvShow) => {
        return tvShow.first_air_date > max ? tvShow.first_air_date : max;
    }, allTvShows.value[0].first_air_date);
});

const filteredTvShows = computed(() => {
    let result = [...allTvShows.value];
    
    if (selectedGenres.value.length > 0) {
        result = result.filter(tvShow => 
            selectedGenres.value.every(genreId => tvShow?.genre_ids.includes(genreId))
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
            result.sort((a, b) => new Date(a.first_air_date) - new Date(b.first_air_date));
            break;
        case 'release_date_desc':
            result.sort((a, b) => new Date(b.first_air_date) - new Date(a.first_air_date));
            break;
    }

    if (filteredTvShowKeyword.value.length > 0) {
        result = result.filter(tvShow => 
            normalizeString(tvShow?.original_name).includes(normalizeString(filteredTvShowKeyword.value))
        );
    }

    if (dateRange.value.from) {
        result = result.filter(tvShow => 
            tvShow.first_air_date >= dateRange.value.from
        );
    }
    if (dateRange.value.to) {
        result = result.filter(tvShow => 
            tvShow.first_air_date <= dateRange.value.to
        );
    }

    if (ratingRange.value.min > 0 || ratingRange.value.max < 10) {
        result = result.filter(tvShow => 
            tvShow.vote_average >= ratingRange.value.min && 
            tvShow.vote_average <= ratingRange.value.max
        );
    }
    
    return result;
});

const categoryEndpoints = {
  'popular': 'popular',
  'airing-today': 'airing_today',
  'top-rated': 'top_rated',
  'on-tv': 'on_the_air'
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

const fetchTvShows = async () => {
  isTvShowsLoading.value = true;
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${currentEndpoint.value}?language=en-US&page=1`,
      options,
    );
    const { results } = await response.json();
    allTvShows.value = results;
    tvShows.value = results;
  } catch (error) {
    console.error(error);
  } finally {
    isTvShowsLoading.value = false;
  }
};

const fetchGenres = async () => {
    try {
        const response = await fetch (
            'https://api.themoviedb.org/3/genre/tv/list?language=en',
            options
        );
        const { genres } = await response.json();
        genresArr.value = genres;
    } catch (error) {
        console.error(error)
    }
};

const handleFavorite = (tvShowObj, type) => {
    const list = type === 'tv' ? tvShows : series;
    const index = list.value.findIndex(item => item.id === tvShowObj.id);
    if (index !== -1) {
        list.value[index].isFavorite = !list.value[index].isFavorite;
    }
};

const handleSearch = () => {
    tvShows.value = filteredTvShows.value;
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
    fetchTvShows();
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
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, '')    
        .replace(/\s+/g, '')            
        .trim();
};

const hasActiveFilters = computed(() => {
    return selectedGenres.value.length > 0 || 
           sortBy.value !== '' || 
           filteredTvShowKeyword.value !== '' ||
           dateRange.value.from !== '' ||
           dateRange.value.to !== '' ||
           ratingRange.value.min > 0 ||
           ratingRange.value.max < 10;
});

const clearFilters = () => {
    selectedGenres.value = [];
    sortBy.value = '';
    filteredTvShowKeyword.value = '';
    dateRange.value = {
        from: '',
        to: maxDate.value
    };
    ratingRange.value = {
        min: 0,
        max: 10
    };
    tvShows.value = allTvShows.value;
};

const updateMax = () => {
    if (ratingRange.value.max < ratingRange.value.min) {
        ratingRange.value.max = ratingRange.value.min;
    }
};

const updateMin = () => {
    if (ratingRange.value.min > ratingRange.value.max) {
        ratingRange.value.min = ratingRange.value.max;
    }
};
</script>