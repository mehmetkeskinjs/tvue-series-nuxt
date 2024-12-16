<template>
    <Header :isVisible="isInputVisible" @toggleInput="toggleInput" :isHeaderFull="isHeaderFull" />
    <GlobalSearch :isVisible="isInputVisible" />

    <div class="bg-gray-900 h-16"></div>

    <div v-if="movieData">
        <!-- Banner Section -->
        <div class="relative w-full h-[500px]">
            <div 
                class="absolute inset-0 bg-cover bg-center"
                :style="`background-image: url('https://media.themoviedb.org/t/p/w1920_and_h800_multi_faces${movieData.backdrop_path}')`"
            >
                <!-- Gradient Overlay -->
                <div class="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/30"></div>
            </div>
        </div>

        <!-- Content Section -->
        <div class="max-w-7xl mx-auto p-6 relative -mt-72">
            <div class="flex gap-8">
                <!-- Movie Poster -->
                <div class="w-80">
                    <img 
                        :src="`https://media.themoviedb.org/t/p/w600_and_h900_bestv2${movieData.poster_path}`"
                        :alt="movieData.title"
                        class="w-full rounded-lg shadow-lg"
                    />
                </div>

                <!-- Movie Details -->
                <div class="flex-1">
                    <!-- Title with Homepage Link -->
                    <h1 class="text-4xl font-bold mb-4 text-white">
                        <a 
                            v-if="movieData.homepage" 
                            :href="movieData.homepage"
                            target="_blank"
                            class="hover:text-blue-500 transition-colors"
                        >
                            {{ movieData.title }}
                        </a>
                        <span v-else>{{ movieData.title }}</span>
                    </h1>

                    <!-- Release Date -->
                    <p class="text-lg mb-4 text-white">
                        <span class="font-semibold">Release Date:</span> 
                        {{ new Date(movieData.release_date).toLocaleDateString() }}
                    </p>

                    <!-- Genres -->
                    <div class="mb-4">
                        <span class="font-semibold text-white">Genres:</span>
                        <div class="flex gap-2 mt-2">
                            <span 
                                v-for="genre in movieData.genres" 
                                :key="genre.id"
                                class="px-3 py-1 bg-gray-700 rounded-full text-sm text-white"
                            >
                                {{ genre.name }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Loading State -->
    <div v-else class="max-w-7xl mx-auto p-6">
        Loading...
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isHeaderFull = ref(true);
const isInputVisible = ref(false);
const movieData = ref(null);

const toggleInput = () => {
    isInputVisible.value = !isInputVisible.value;
};

onMounted(async () => {
    try {
        const url = 'https://api.themoviedb.org/3/movie/912649?language=en-US';
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_READ_ACCESS_TOKEN}`
            }
        };

        const response = await fetch(url, options);
        const data = await response.json();
        movieData.value = data;
        console.log(data);
    } catch (error) {
        console.error('Error fetching movie data:', error);
    }
});
</script>
