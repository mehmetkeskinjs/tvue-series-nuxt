<template>
    <div
        href="#"
        class="relative min-w-[250px] cursor-pointer snap-start overflow-hidden rounded-3xl bg-white text-neutral-500 shadow-lg transition duration-200 hover:bg-neutral-200/50"
    >
        <button
            v-if="!movie.isFavorite"
            class="absolute right-4 top-4 z-20 text-zinc-500/70 transition hover:text-zinc-900"
            @click="setFavorite(movie, movieType)"
        >
            <svg
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="0.5"
                stroke="currentColor"
                class="size-6"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
            </svg>
        </button>
        <button
            v-else
            class="absolute right-4 top-4 z-20 text-pink-600/80 transition"
            @click="setFavorite(movie, movieType)"
        >
            <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                stroke-width="0.5"
                stroke="currentColor"
                class="size-6"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
            </svg>
        </button>
        <h3 class="truncate p-4 pr-12">
            {{ movie.title || movie.name }}
        </h3>
        <div class="h-full max-h-64 p-4 2xl:max-h-80">
            <img
                :src="generateImage(movie.poster_path)"
                :alt="movie.title"
                class="mx-auto block h-full rounded-2xl shadow-2xl"
            />
        </div>
        <div class="flex items-center justify-between gap-4 p-4">
            <span class="mt-1 text-xs">{{ date }}</span>

            <span
                class="mt-2 flex w-fit items-center rounded-lg px-2 py-1 text-base font-medium text-neutral-500 ring-1 ring-inset ring-neutral-700"
            >
                {{ movie.vote_average.toFixed(1) }}
                <span class="-ml-1 flex items-center font-light">
                    <svg viewBox="0 0 10 16" fill="currentColor" class="size-4">
                        <path
                            fill-rule="evenodd"
                            d="M10.074 2.047a.75.75 0 0 1 .449.961L6.705 13.507a.75.75 0 0 1-1.41-.513L9.113 2.496a.75.75 0 0 1 .961-.449Z"
                            clip-rule="evenodd"
                        /></svg
                    >10</span
                >
            </span>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const date = ref('');
const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];
const movieType = ref('movies');

const emit = defineEmits(['handle-favorite']);
const props = defineProps({
    movie: {
        type: Object,
        required: true,
    },
    movieKeyword: {
        type: Object,
        required: true,
    },
});

const setFavorite = (movieObj, type) => {
    emit('handle-favorite', movieObj, type);
};

const generateImage = (path) => {
    return `https://media.themoviedb.org/t/p/w440_and_h660_face/${path}`;
};

const createNewDate = (rawDate) => {
    if (rawDate === '') {
        date.value = '';

        return;
    }

    const splittedDate = rawDate.split('-');

    date.value = `${months[Number(splittedDate[1]) - 1].slice(0, 3)} ${splittedDate[2]}, ${splittedDate[0]}`;
};

onMounted(() => {
    if (props.movie.release_date) {
        createNewDate(props.movie.release_date);
    } else {
        createNewDate(props.movie.first_air_date);
    }

    movieType.value = props.movieKeyword.type;
});
</script>
