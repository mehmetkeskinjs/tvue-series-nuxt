<template>
    <div v-if="isVisible" class="relative">
        <div
            class="absolute left-0 top-0 z-50 h-16 w-full bg-zinc-200/10 backdrop-blur-[2px]"
        ></div>
        <div class="absolute left-10 top-[4.5rem] z-20 text-zinc-800/40">
            <svg
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
            </svg>
        </div>
        <input
            type="text"
            placeholder="Search for movie, tv show or people"
            class="absolute top-16 z-10 w-full bg-zinc-50 py-2 pl-[4.7rem] pr-8 outline-none transition-all focus-within:outline-none"
            v-model="searchQuery"
            @input="handleSearch"
            @keyup.enter="performSearch"
        />

        <GlobalInputSearchList
            :searchList="searchList"
            :searchQuery="searchQuery"
        />
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import GlobalInputSearchList from './GlobalInputSearchList.vue';

const searchList = ref([]);
const searchQuery = ref('');

const props = defineProps({
    isVisible: Boolean,
});

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_READ_ACCESS_TOKEN}`,
    },
};

const searchMovies = async () => {
    if (searchQuery.value.trim() === '') {
        searchList.value = [];
        return;
    }
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(searchQuery.value)}&include_adult=false&language=en-US&page=1`,
            options,
        );
        const { results } = await response.json();
        searchList.value = results;
    } catch (error) {
        console.error(error);
    }
};

const handleSearch = () => {
    if (searchTimeoutId.value) {
        clearTimeout(searchTimeoutId.value);
    }
    searchTimeoutId.value = setTimeout(searchMovies, 500);
};

const searchTimeoutId = ref(null);

const performSearch = () => {
    if (searchTimeoutId.value) {
        clearTimeout(searchTimeoutId.value);
    }
    searchMovies();
};

// Clean up the timeout when the component is unmounted
onUnmounted(() => {
    if (searchTimeoutId.value) {
        clearTimeout(searchTimeoutId.value);
    }
});
</script>
