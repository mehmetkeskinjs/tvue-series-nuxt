<template>
    <div class="mt-5 flex w-full items-center justify-between">
        <div class="flex flex-col text-xl">
            <span :key="movie.id" class="capitalize text-zinc-200">{{
                movie.title
            }}</span>

            <span :key="movie.id" class="text-xs font-light text-zinc-400">{{
                movie.year
            }}</span>
        </div>
        <a
            :href="movie.link"
            target="_blank"
            class="group flex cursor-pointer select-none items-center rounded-full bg-white px-3 py-1"
        >
            See details
            <span
                class="mt-[2px] transition-all duration-300 group-hover:translate-x-1"
            >
                <svg viewBox="0 0 16 16" fill="currentColor" class="size-4">
                    <path
                        fill-rule="evenodd"
                        d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z"
                        clip-rule="evenodd"
                    />
                </svg>
            </span>
        </a>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';

const props = defineProps({
    movie: {
        type: Object,
        required: true,
    },
});
</script>
