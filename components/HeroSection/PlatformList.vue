<template>
    <div class="mt-6 flex w-full items-center justify-between gap-2 pb-10">
        <div
            class="flex w-1/6 flex-col items-center overflow-hidden"
            v-for="platform in platforms"
            :key="platform.id"
        >
            <img
                :src="platform.image"
                class="aspect-square w-14 rounded-lg bg-white object-cover"
                alt=""
            />
            <span class="mt-2 text-xs font-light text-slate-300">{{
                platform.name
            }}</span>
            <span class="text text-[11px] font-light text-slate-300/60">{{
                platform.country
            }}</span>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    platforms: {
        type: Array,
        required: true,
    },
});
</script>
