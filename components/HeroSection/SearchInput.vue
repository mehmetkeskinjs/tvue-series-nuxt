<template>
    <div class="relative mt-8 w-full">
        <span
            class="absolute left-4 z-10 flex h-full items-center fill-none text-zinc-300"
        >
            <svg viewBox="0 0 20 20" fill="currentColor" class="size-5">
                <path
                    fill-rule="evenodd"
                    d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
                    clip-rule="evenodd"
                />
            </svg>
        </span>
        <input
            type="text"
            placeholder="What are you looking for?"
            v-model="searchQuery"
            @input="makeButtonVisible(searchQuery)"
            class="h-12 w-full rounded-xl bg-gray-400/10 px-12 py-4 text-base font-light text-white ring-1 ring-inset ring-slate-50/10 backdrop-blur-xl focus-visible:outline-none"
        />
        <button
            v-if="isButtonVisible"
            class="absolute right-1 top-1 flex h-10 items-center justify-center rounded-lg bg-gradient-to-r from-zinc-950 to-zinc-900 px-4 text-sm font-normal text-slate-200 shadow before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,theme(colors.white/.5)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:[transition:background-position_0s_ease] hover:before:bg-[position:-100%_0,0_0] hover:before:duration-[1500ms] focus:outline-none focus:ring focus:ring-slate-500/50 focus-visible:outline-none focus-visible:ring focus-visible:ring-slate-500/50"
        >
            Search
        </button>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const isButtonVisible = ref(false);
const searchQuery = ref('');

const makeButtonVisible = (searchQuery) => {
    if (searchQuery.length >= 3) {
        isButtonVisible.value = true;
    } else {
        isButtonVisible.value = false;
    }
};
</script>
