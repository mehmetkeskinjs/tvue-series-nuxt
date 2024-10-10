<template>
    <div class="container relative px-12 py-8">
        <div>
            <div class="flex items-center justify-between">
                <div class="flex items-end gap-6">
                    <h1 class="text-3xl font-medium">{{ title }}</h1>

                    <TabNavigator
                        @keyword-selected="keywordChanged"
                        :movieKeyword="movieKeyword"
                    />
                </div>

                <div class="flex items-center gap-3">
                    <button
                        :class="{
                            'cursor-pointer bg-neutral-200 ring-neutral-300/20':
                                !isPrevButtonDisabled,
                            'cursor-not-allowed bg-neutral-200/40 text-neutral-400 ring-neutral-100/20':
                                isPrevButtonDisabled,
                        }"
                        @click="prevSlider"
                        :disabled="isPrevButtonDisabled"
                        class="flex aspect-square w-10 cursor-pointer items-center justify-center rounded-full ring"
                    >
                        <svg
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="mr-[2px] size-5"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M15.75 19.5 8.25 12l7.5-7.5"
                            />
                        </svg>
                    </button>
                    <button
                        :class="{
                            'cursor-pointer bg-neutral-200 ring-neutral-300/20':
                                !isNextButtonDisabled,
                            'cursor-not-allowed bg-neutral-200/40 text-neutral-400 ring-neutral-100/20':
                                isNextButtonDisabled,
                        }"
                        :disabled="isNextButtonDisabled"
                        @click="nextSlider"
                        class="flex aspect-square w-10 cursor-pointer items-center justify-center rounded-full ring"
                    >
                        <svg
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="ml-[2px] size-5"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="m8.25 4.5 7.5 7.5-7.5 7.5"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            <div v-if="isMoviesLoading" class="flex gap-2 pb-4 pt-6">
                <MovieCardSkeleton v-for="n in 5" :key="n" />
            </div>

            <ul
                v-else
                ref="sliderContainer"
                class="no-scrollbar flex w-full min-w-full snap-x snap-mandatory flex-row gap-2 overflow-auto pb-4 pt-6"
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
import MovieCardSkeleton from './MovieCardSkeleton.vue';
import MovieCard from './MovieCard.vue';
import TabNavigator from './TabNavigator.vue';
import { ref } from 'vue';

const sliderContainer = ref(null);
const isNextButtonDisabled = ref(false);
const isPrevButtonDisabled = ref(true);

const { movies } = defineProps({
    title: {
        type: String,
        required: true,
    },
    isMoviesLoading: {
        type: Boolean,
        required: true,
    },
    movies: {
        type: Array,
        required: true,
    },
    movieKeyword: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(['keyword-changed', 'handle-favorite']);

const keywordChanged = (tabValue, type) => {
    emit('keyword-changed', tabValue, type);
};

const handleFavorite = (movieObj, type) => {
    emit('handle-favorite', movieObj, type);
};

//TODO: slider logic -------------
const nextSlider = () => {};

const prevSlider = () => {};
</script>
