<template>
    <Header :isVisible="isInputVisible" @toggleInput="toggleInput" :isHeaderFull="isHeaderFull" />
    <GlobalSearch :isVisible="isInputVisible" />

    <div class="bg-gray-900 h-16"></div>

    <div v-if="tvSeriesData" class="relative pb-10">
        <div class="relative w-full h-[600px]">
            <div 
                class="absolute inset-0 bg-cover bg-center"
                :style="`background-image: url('https://media.themoviedb.org/t/p/w1920_and_h800_multi_faces${tvSeriesData.backdrop_path}')`"
            >
                <div class="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/30"></div>
            </div>
        </div>

        <div class="absolute top-12 w-[90%] px-20">
            <div class="flex gap-8">
                <div class="w-80">
                    <img 
                        :src="`https://media.themoviedb.org/t/p/w600_and_h900_bestv2${tvSeriesData.poster_path}`"
                        :alt="tvSeriesData.name"
                        class="w-full rounded-lg shadow-lg"
                    />
                </div>

                <div class="flex-1">
                    <h1 class="text-4xl font-bold mb-4 text-white">
                        <a 
                            v-if="tvSeriesData.homepage" 
                            :href="tvSeriesData.homepage"
                            target="_blank"
                            class="hover:text-blue-500 transition-colors"
                        >
                            {{ tvSeriesData.name }}
                        </a>
                        <span v-else>{{ tvSeriesData.title }}</span>
                        <div class="mt-2">
                            <span class=" text-orange-700">{{ tvSeriesData.vote_average.toFixed(2) }}</span> <span class="text-2xl">/ 10</span>
                        </div>
                    </h1>

                    <div class="mb-4 text-white max-w-[60%]">{{ tvSeriesData.overview }}</div>

                    <p class="text-lg mb-4 text-white">
                        <span class="font-semibold">First Air Date:</span> 
                        {{ new Date(tvSeriesData.first_air_date).toLocaleDateString() }}
                    </p>

                    <div class="mb-4">
                        <span class="font-semibold text-white">Genres:</span>
                        <div class="flex gap-2 mt-2">
                            <span 
                                v-for="genre in tvSeriesData.genres" 
                                :key="genre.id"
                                class="px-3 py-1 bg-gray-700 rounded-full text-sm text-white"
                            >
                                {{ genre.name }}
                            </span>
                        </div>
                    </div>

                    <div class="mt-6 max-w-[25%] text-white absolute right-0 top-0 w-fit bg-black/40 p-4 rounded-xl">
                        <h3 class="text-xl mb-4">Additional Informations</h3>
                        <p class="mb-3"><span class="font-semibold">Status:</span> <span class="text-white/70 font-light ml-1">{{ tvSeriesData.status }}</span></p>
                        <p class="mb-3"><span class="font-semibold">Language:</span> <span class="text-white/70 font-light ml-1">{{ tvSeriesData.original_language.toUpperCase() }}</span></p>
                        <p class="mb-3"><span class="font-semibold">Tagline:</span> <span class="text-white/70 font-light ml-1">{{ tvSeriesData.tagline }}</span></p>
                        <p class="mb-3">
                            <span class="font-semibold">Number of Season:</span> 
                            <span class="text-white/70 font-light ml-1">{{ tvSeriesData.number_of_seasons }}</span>
                        </p>
                        <p>
                            <span class="font-semibold">Number of Episodes:</span> 
                            <span class="text-white/70 font-light ml-1">{{ tvSeriesData.number_of_episodes }}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>


        <div class="px-20">
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
const tvSeriesData = ref(null);
const castData = ref([]);

const toggleInput = () => {
    isInputVisible.value = !isInputVisible.value;
};

onMounted(async () => {
    const tvSeriesId = route.params.id;
    try {
        const tvSeriesUrl = `https://api.themoviedb.org/3/tv/${tvSeriesId}?language=en-US`;
        const tvSeriesOptions = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_READ_ACCESS_TOKEN}`
            }
        };

        const tvSeriesResponse = await fetch(tvSeriesUrl, tvSeriesOptions);
        tvSeriesData.value = await tvSeriesResponse.json();
        
        const castUrl = `https://api.themoviedb.org/3/tv/${tvSeriesId}/credits?language=en-US`;
        const castResponse = await fetch(castUrl, tvSeriesOptions);
        const castDataResponse = await castResponse.json();
        castData.value = castDataResponse.cast;

        console.log(tvSeriesData.value)
    } catch (error) {
        console.error('Error fetching TV series data:', error);
    }
});
</script>
