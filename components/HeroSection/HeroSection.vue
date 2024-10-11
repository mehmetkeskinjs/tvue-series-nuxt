<template>
    <div class="relative h-screen">
        <img
            :src="heroMovieDetail.image"
            class="h-full w-full object-cover transition-all"
            :alt="heroMovieDetail.title"
        />
        <div
            class="absolute inset-0 flex h-full items-end bg-gradient-to-t from-black/80 to-black/50 2xl:pb-24"
        >
            <div
                class="container flex w-fit flex-col items-center justify-between px-12"
            >
                <h1 class="mt-5 text-5xl font-normal text-zinc-100">
                    Find movies & TV shows
                </h1>
                <p class="mt-3 text-lg font-light tracking-wide text-zinc-300">
                    Discover your favorite movies or TV shows
                </p>

                <SearchInput />

                <div class="mt-8 flex items-center gap-3">
                    <button
                        v-for="movie in featuredMovies"
                        :key="movie.id"
                        :bullet-id="movie.id"
                        class="aspect-square w-[10px] rounded-full bg-zinc-100 transition-all duration-300"
                        :class="{
                            'opacity-100 ring ring-zinc-600':
                                activeBullet === movie.id - 1,
                            'opacity-50': activeBullet !== movie.id - 1,
                        }"
                        @click="setBulletId(movie.id - 1)"
                    ></button>
                </div>

                <HeroMovie :movie="heroMovieDetail" v-if="heroMovieDetail" />
                <PlatformList :platforms="platformList" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import HeroMovie from './HeroMovie.vue';
import PlatformList from './PlatformList.vue';
import SearchInput from './SearchInput.vue';
import { platforms as platformData } from '../../assets/platforms.js';

const heroMovieDetail = ref({});
const platformList = ref([]);
const activeBullet = ref(0);

let featuredMovies = [
    {
        id: 1,
        title: 'napoleon',
        year: '2024',
        image: '/napoleon-bg.jpg',
    },
    {
        id: 2,
        title: 'joker',
        year: '2019',
        image: '/joker-bg.jpg',
    },
    {
        id: 3,
        title: 'the batman',
        year: '2022',
        image: '/batman-bg.jpg',
    },
];

const generateMovieLink = (title) => {
    return `https://www.google.com/search?q=${title}`;
};

featuredMovies = featuredMovies.map((movie) => ({
    ...movie,
    link: generateMovieLink(movie.title),
}));

const setBulletId = (id) => {
    activeBullet.value = id;
    heroMovieDetail.value = featuredMovies[activeBullet.value];
};

onMounted(() => {
    platformList.value = platformData;
    heroMovieDetail.value = featuredMovies[activeBullet.value];
});
</script>
