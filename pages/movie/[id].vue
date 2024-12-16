<template>
    <Header :isVisible="isInputVisible" @toggleInput="toggleInput" :isHeaderFull="isHeaderFull" />
    <GlobalSearch :isVisible="isInputVisible" />

    <div class="bg-gray-900 h-16"></div>

    <div v-if="movieData" class="relative">
        <div class="relative w-full h-[600px]">
            <div 
                class="absolute inset-0 bg-cover bg-center"
                :style="`background-image: url('https://media.themoviedb.org/t/p/w1920_and_h800_multi_faces${movieData.backdrop_path}')`"
            >
                <div class="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/30"></div>
            </div>
        </div>

        <div class="container absolute top-12 left-10">
            <div class="flex gap-8">
                <div class="w-80">
                    <img 
                        :src="`https://media.themoviedb.org/t/p/w600_and_h900_bestv2${movieData.poster_path}`"
                        :alt="movieData.title"
                        class="w-full rounded-lg shadow-lg"
                    />
                </div>

                <div class="flex-1">
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
                        <div class="mt-2">
                            <span class=" text-orange-700">{{ movieData.vote_average.toFixed(2) }}</span> <span class="text-2xl">/ 10</span>
                        </div>
                    </h1>

                    <div class="mb-4 text-white max-w-[60%]">{{ movieData.overview }}</div>

                    <p class="text-lg mb-4 text-white">
                        <span class="font-semibold">Release Date:</span> 
                        {{ new Date(movieData.release_date).toLocaleDateString() }}
                    </p>

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

                    <div class="mt-6 max-w-[25%] text-white absolute right-0 top-0 w-fit bg-black/40 p-4 rounded-xl">
                        <h3 class="text-xl mb-4">Additional Informations</h3>
                        <p class="mb-3"><span class="font-semibold">Status:</span> <span class="text-white/70 font-light ml-1">{{ movieData.status }}</span></p>
                        <p class="mb-3"><span class="font-semibold">Language:</span> <span class="text-white/70 font-light ml-1">{{ movieData.original_language.toUpperCase() }}</span></p>
                        <p class="mb-3"><span class="font-semibold">Tagline:</span> <span class="text-white/70 font-light ml-1">{{ movieData.tagline }}</span></p>
                        <p>
                            <span class="font-semibold">Runtime:</span> 
                            <span class="text-white/70 font-light ml-1">{{ Math.floor(movieData.runtime / 60) }}hr {{ movieData.runtime % 60 }}min</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>


        <div class="container">
            <div class="mt-10">
                <h2 class="text-2xl font-semibold mb-4">Cast <span class="text-zinc-400">({{ castData.length }} People)</span></h2>
                <div class="flex w-full min-w-full flex-row gap-2 overflow-auto">
                    <div
                        v-for="castMember in castData" 
                        :key="castMember.id" 
                        class="rounded-lg text-center border flex flex-col min-w-[150px]"
                    >
                        <img 
                            v-if="castMember.profile_path"
                            :src="`https://media.themoviedb.org/t/p/w138_and_h175_face${castMember.profile_path}`" 
                            :alt="castMember.name" 
                            class="w-full rounded-lg bg-gray-800 h-[50%] flex-1"
                        />
                        <div v-else class="bg-gray-200 rounded flex-1 h-[50%]"></div>
                        <div class="h-[70px] mt-2 items-center py-2 px-4 text-sm">
                            <h3 class=" font-semibold truncate">{{ castMember.name }}</h3>
                            <p class="text-gray-400 truncate">{{ castMember.character }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-else class="max-w-7xl mx-auto p-6">
        Loading...
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isHeaderFull = ref(true);
const isInputVisible = ref(false);
const movieData = ref(null);
const castData = ref([]);

const toggleInput = () => {
    isInputVisible.value = !isInputVisible.value;
};

onMounted(async () => {
    const movieId = route.params.id;
    try {
        const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;
        const movieOptions = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_READ_ACCESS_TOKEN}`
            }
        };

        const movieResponse = await fetch(movieUrl, movieOptions);
        movieData.value = await movieResponse.json();

        const castUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`;
        const castResponse = await fetch(castUrl, movieOptions);
        const castDataResponse = await castResponse.json();
        castData.value = castDataResponse.cast;
    } catch (error) {
        console.error('Error fetching movie data:', error);
    }
});
</script>
